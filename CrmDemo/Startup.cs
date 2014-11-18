using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(CrmDemo.Startup))]

namespace CrmDemo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
