namespace DIMA.Handlers
{
  using System;
  using System.IO;
  using System.Web;
  using System.Web.SessionState;
  using System.Web.Script.Serialization;
  using System.Net;
  using System.DirectoryServices.Protocols;
  using System.Diagnostics;
  using Newtonsoft.Json;

  public class User
  {
    public string UserName { get; set; }
    public string Password { get; set; }
  }

  public class ldapAuth : IHttpHandler, IRequiresSessionState
  {

    public void ProcessRequest(HttpContext context)
    {
      User user = null;
      bool authorized = false;
      string requestData = new StreamReader(context.Request.InputStream).ReadToEnd();

        context.Response.ContentType = "application/json";
        user = JsonConvert.DeserializeObject<User>(requestData);
        authorized = Authorize(user);
        JavaScriptSerializer js = new JavaScriptSerializer();
        string json = js.Serialize(authorized);
        Debug.WriteLine("authorized:" + json);
        context.Response.Write(json.ToString());
    }

    public static bool Authorize(User user)
    {
      int ldapPort = 5389;
      String username = user.UserName; // gauss
      String LDAPPassword = user.Password; // Llamas01
      String ldapHost = "ldap-one.igis.local";
      String bindDN = "dc=igis,dc=com";
      String LDAPUser = "cn=" + username + ",cn=Roles,ou=external," + bindDN;
      String response = "";
      bool connected = false;
      bool authenticated = false;
      
      try
      {
        // Create the new LDAP connection
        LdapDirectoryIdentifier ldi = new LdapDirectoryIdentifier(ldapHost, ldapPort);
        LdapConnection ldapConnection = new LdapConnection(ldi);
        connected = true;
        Debug.WriteLine("Ldap Connection is created successfully." + username + " => " + LDAPPassword);
        response += "Ldap Connection is created successfully";

        ldapConnection.AuthType = AuthType.Basic;
        ldapConnection.SessionOptions.ProtocolVersion = 3;
        NetworkCredential credential = new NetworkCredential(username, LDAPPassword);
        ldapConnection.Bind(credential);
        authenticated = true;
        Debug.WriteLine("LdapConnection is successfully authenticated" + ldapConnection);
        response += " and authenticated";
        
        ldapConnection.Dispose();
      }
      catch (LdapException e)
      {
        response = "\r\nUnable to login:\r\n\t" + e.Message;
      }
      catch (Exception e)
      {
        response = "\r\nUnexpected exception occured:\r\n\t" + e.GetType() + ":" + e.Message;
      }
      bool temp = connected && authenticated;
      Debug.WriteLine(response + " : " + temp + " -> " + connected + " " + authenticated);
      return connected && authenticated;
    }


     
}