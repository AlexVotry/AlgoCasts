///   <%@ WebHandler Language="C#" Class="getGenDeactivationsHistorical" %>

using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Security.Principal;

using System.Data;
using Oracle.ManagedDataAccess.Client; // ODP.NET, Managed Driver
using Oracle.ManagedDataAccess.Types;

using System.Net;
using System.Text;


public class getGenDeactivationsHistorical : IHttpHandler
{
    private Settings settings;
    private string settingsFileName = "getGenDeactivationsHistorical.json";
    private string errorResponse = "{Errors: 'error occurred'}";

    public void ProcessRequest(HttpContext context)
    {
        string json = string.Empty;
        bool forceFresh = false;

        string requestData;
          using (var reader = new StreamReader(context.Request.InputStream))
          {
            // This will equal to "charset = UTF-8 & param1 = val1 & param2 = val2 & param3 = val3 & param4 = val4"
            requestData = reader.ReadToEnd();
          }

        string env = requestData.Split('=')[1];

        if (env != "prod") {
          env = "dev"
        }


        string paramForce = context.Request.Params["force"];

        //bool csvOutput = false;
        //string paramCSV = context.Request.Params["csv"];

        string rawResults = "{'ProcessRequest': 'error'}";

        // if force = 1 || cached == null || cached date is older than x hours
        if (null != paramForce && (paramForce == "1" || paramForce == "true" || paramForce == string.Empty))
        {
            forceFresh = true;
        }
        //if (null != paramCSV && (paramCSV == "1" || paramCSV == "true" || paramCSV == string.Empty)) {
        //    csvOutput = true;
        //}

        // if forceFresh then load from service
        // else try from cache if exists
        if (!forceFresh && isCacheValid(env))
        {
            rawResults = loadCached(env);
        }
        else
        {
            rawResults = loadPlanning(env);
        }

        try
        {
            json = rawResults;
            if (json == errorResponse)
            {
                json = loadCached(env);
            }
        }
        catch (Exception e)
        {
            json = loadCached(env);
        }



        context.Response.ContentType = "application/json";
        context.Response.Write(json);

    }
    
    public bool isCacheValid(string env) {
        bool bReturn = false;
        if (null == settings)
        {
            loadSettings(env);
        }
        if (null != settings && settings.loaded)
        {
            try
            {
                string path = settings.serverPath + @"handlers\planning\cache\" + settingsFileName;
                if (File.Exists(path))
                {
                    DateTime dt = File.GetLastWriteTime(path);
                    TimeSpan diff = DateTime.Now - dt;
                    double hours = diff.TotalHours;
                    if (hours <= settings.cacheExpiresHours)
                    {
                        bReturn = true;
                    }
                }
            }

            catch (Exception e)
            {
                Console.WriteLine("The process failed: {0}", e.ToString());
            }
        }
        return bReturn;
    }
    public string loadCached(string env)
    {
        string results = errorResponse;

        if (null == settings)
        {
            loadSettings(env);
        }


        if (null != settings && settings.loaded)
        {
            using (StreamReader r = new StreamReader(settings.serverPath + @"handlers\planning\cache\" + settingsFileName))
            {
                results = r.ReadToEnd();
            }
            JavaScriptSerializer jss = new JavaScriptSerializer();
            jss.MaxJsonLength = Int32.MaxValue;
            ServiceResults sr = new ServiceResults();
            sr = jss.Deserialize<ServiceResults>(results);
            results = jss.Serialize(sr);
        }
        return results;
    }
    public string loadPlanning(string env)
    {
        string results = errorResponse;
        if (null == settings)
        {
            loadSettings(env);
        }

        if (null != settings && settings.loaded)
        {
            try
            {
                results = loadOracleData(settings.dataSource1, settings);
                // if the results are still empty, try the second connection string
                if (results == errorResponse || results == "")
                {
                    results = loadOracleData(settings.dataSource2, settings);
                }
            }
            catch (Exception e)
            {
                // if we had an exception, try the second connection string
                try
                {
                    results = loadOracleData(settings.dataSource2, settings);
                }
                catch (Exception e2)
                {
                    results = "{'Errors': '" + e2.Message + "'}";
                }
            }
            JavaScriptSerializer jss = new JavaScriptSerializer();
            jss.MaxJsonLength = Int32.MaxValue;
            ServiceResults sr = new ServiceResults();

            sr.Data = jss.Deserialize<List<PlanningResult>>(results);
            sr.Date = DateTime.Now.ToString("G");
            sr.Count = sr.Data.Count;

            if (sr.Count > 0 && string.IsNullOrEmpty(sr.Errors) && string.IsNullOrEmpty(sr.Message))
            {
                // write the results to a cached local file
                using (System.IO.StreamWriter file = new System.IO.StreamWriter(settings.serverPath + @"handlers\planning\cache\" + settingsFileName, false))
                {

                    // write to the cache file that it's cache
                    sr.Status = "cache";

                    string fileContents = jss.Serialize(sr);
                    file.WriteLine(fileContents);
                    // return the client that we loaded new data
                    sr.Status = "planning";
                    results = jss.Serialize(sr);
                }
            }
        }

        return results;
    }

    private string loadOracleData(string dataSource, Settings settings)
    {
        string oradb = "Data Source=" + dataSource + ";User Id=" + settings.userID + ";Password=" + settings.password;
        OracleConnection con = new OracleConnection(oradb);
        con.Open();
        OracleCommand cmd = new OracleCommand();
        cmd.Connection = con;
        cmd.CommandText = settings.oracleStatement;
        cmd.CommandType = CommandType.Text;
        OracleDataReader dr = cmd.ExecuteReader();
        //Format the data as a JSON
        var output2 = OracleDataReader2JSON(dr);
        con.Dispose();
        //System.IO.File.WriteAllText(@"E:\inetpub\ISM\handlers\planning\cache\prodGetDeactivatedGenerators.json", output2);

        return output2;
    }

    private string OracleDataReader2JSON(OracleDataReader odr)
    {
        //Read the results from the query
        var RowList = new List<object>();
        while (odr.Read())
        {
            var ColList = new Dictionary<object, object>();
            int i = 0;
            // For each fo the columns in the table. Find the column name.
            foreach (DataRow dr in odr.GetSchemaTable().Rows)
            {
                ColList.Add(dr[0].ToString(), odr[i]);
                i++;
            }
            RowList.Add(ColList);

        }
        //Standard JSON Serialization
        JavaScriptSerializer js = new JavaScriptSerializer();
        string JSON = js.Serialize(RowList);
        return JSON;
    }

    public class Settings
    {
        public bool loaded = false;
        public string serverPath { get; set; }
        public string dataSource1 { get; set; }
        public string dataSource2 { get; set; }
        public string oracleStatement { get; set; }
        public string userID { get; set; }
        public string password { get; set; }
        public float cacheExpiresHours { get; set; }
    }
    public Settings loadSettings(string env)
    {
        string serverPath = System.Web.HttpContext.Current.Server.MapPath("~/");
        if (null == settings)
        {
            settings = new Settings();
        }
        settings.oracleStatement = "SELECT distinct sub.substation_mrid, sm.synchronous_machine_mrid, pool.pool_name as POOL, geo.geo_name as ZONE, sub.s3_name as B1, vl.s3_name as B2, sm.s3_name as B3, sm.LOGBOOK_TEXT FROM   pim_network.synchronous_machine_hist_t sm INNER JOIN pim_network.voltage_level_hist_t vl ON vl.voltage_level_mrid = sm.voltage_level_mrid INNER JOIN pim_network.substation_hist_t sub ON sub.substation_mrid = vl.substation_mrid INNER JOIN pim_network.subgeographical_region_hist_t sg ON sg.subgeo_mrid = sub.subgeo_mrid INNER JOIN pim_network.geographical_region_hist_t geo ON sg.geo_mrid = geo.geo_mrid INNER JOIN pim_network.pool_hist_t pool ON geo.pool_mrid = pool.pool_mrid and pool.pool_name = 'PJM' order by pool, zone, b1, b2, b3"

        List<string> config = new List<string>();
            if (ConfigurationManager.AppSettings.Count > 0)
            {
                config.Add(ConfigurationManager.AppSettings["HistoricalUserID"]);
                config.Add(ConfigurationManager.AppSettings["HistoricalPassword"]);
                config.Add(ConfigurationManager.AppSettings[env + "HistoricalDataSource1"]);
                config.Add(ConfigurationManager.AppSettings[env + "HistoricalDataSource2"]);
            }

            settings.serverPath = serverPath;
            settings.userID = config[0];
            settings.password = config[1];
            settings.dataSource1 = config[2];
            settings.dataSource2 = config[3];
            settings.cacheExpiresHours = 24;
            settings.loaded = true;

            return settings;
        }

    public class ServiceResults
    {
        public List<PlanningResult> Data { get; set; }
        public int Count { get; set; }
        public string Errors { get; set; }
		public string Message { get; set; }
        public string Status { get; set; }
        public string Date { get; set; }
    }
    public class PlanningResult
    {
        //public object _id {get; set;} // data comes in as $id        
        public string SUBSTATION_MRID { get; set; }
        public string SYNCHRONOUS_MACHINE_MRID { get; set; }
        public string POOL { get; set; }
        public string ZONE { get; set; }
        public string B1 { get; set; }
        public string B2 { get; set; }
        public string B3 { get; set; }
        public string LOGBOOK_TEXT { get; set; }

    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }



}