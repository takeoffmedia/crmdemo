using CrmDemo.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace CrmDemo.Migrations
{
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<Models.AppContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(AppContext context)
        {
            var userManager = new UserManager<User>(new UserStore<User>());
            const string name = "admin";
            const string password = "@Demo01";


            var user = userManager.FindByName(name);
            if (user != null) return;

            user = new User { UserName = name };
            userManager.Create(user, password);
        }
    }
}
