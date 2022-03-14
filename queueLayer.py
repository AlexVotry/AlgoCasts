try:
        print("Synchonizing changes...")
        print("DBO.Internal_GEO_Model")
        arcpy.SynchronizeChanges_management(geodatabase_1=settings.admin_workspace, in_replica="DBO.Internal_GEO_Model", geodatabase_2=settings.sync_workspace, in_direction="FROM_GEODATABASE1_TO_2", conflict_policy="IN_FAVOR_OF_GDB1", conflict_definition="BY_OBJECT", reconcile="DO_NOT_RECONCILE")
        if settings.ENVIRONMENT == 'test':
            print("DBO.External_GEO_Model_1")
            arcpy.SynchronizeChanges_management(geodatabase_1=settings.admin_workspace, in_replica="DBO.External_GEO_Model_1", geodatabase_2=settings.sync2_workspace, in_direction="FROM_GEODATABASE1_TO_2", conflict_policy="IN_FAVOR_OF_GDB1", conflict_definition="BY_OBJECT", reconcile="DO_NOT_RECONCILE")
            print("Synchronizing Complete...")
        elif settings.ENVIRONMENT == 'prod':
            print("DBO.External_GEO_Model_1")
            arcpy.SynchronizeChanges_management(geodatabase_1=settings.admin_workspace, in_replica="DBO.External_GEO_Model_1", geodatabase_2=settings.sync2_workspace, in_direction="FROM_GEODATABASE1_TO_2", conflict_policy="IN_FAVOR_OF_GDB1", conflict_definition="BY_OBJECT", reconcile="DO_NOT_RECONCILE")
            print("DBO.External_GEO_Model_2")
            arcpy.SynchronizeChanges_management(geodatabase_1=settings.sync2_workspace, in_replica="DBO.External_GEO_Model_2", geodatabase_2=settings.sync3_workspace, in_direction="FROM_GEODATABASE1_TO_2", conflict_policy="IN_FAVOR_OF_GDB1", conflict_definition="BY_OBJECT", reconcile="DO_NOT_RECONCILE")
            print("Synchronizing Complete...")

class Syncho:
  internal = {"replica": "DBO.Internal_GEO_Model", }
