using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace CrmDemo.Models
{
    public class AppContext : IdentityDbContext<User>
    {
        public AppContext()
            : base("DefaultConnection")
        {
        }
    }
}