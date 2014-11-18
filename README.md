crmdemo
=======

## [Demo Site](http://crmdemo.takeoffmedia.com)

###Credentials:
*Username: admin
*Password: @Demo01

---

### Configuration:

To run application the following connection strings should be configured in CrmDemo project web.config file:

  <connectionStrings>
    <add name="DefaultConnection" connectionString="[DB connection string]" providerName="System.Data.SqlClient" />
    <add name="Crm" connectionString="[Dynamics CRM connection]" />
  </connectionStrings>
  
To run the tests the following connection string should be configured in CrmDemo.Test project app.config file:

  <connectionStrings>
    <add name="Crm" connectionString="[Dynamics CRM connection]" />
  </connectionStrings> 
  
---  

### Notes:
  
+ A MVC controller is used to load the web page with the templates and the required javascript/css bundles.
+ Web Api template was used to generate the project.
+ Angular-Spa-Security package used to manage authentication with AngularJs
  
