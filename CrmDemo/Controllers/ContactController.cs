using System;
using System.Web.Http;
using Microsoft.Xrm.Client.Services;
using CrmDemo.Models;
using CrmDemo.Services;
using Xrm;

namespace CrmDemo.Controllers
{
    [Authorize]
    public class ContactController : ApiController
    {
        private readonly CrmManager _crmManager;

        //DI container should be added
        public ContactController()
            : this(new CrmManager(new XrmServiceContext(new OrganizationService("Crm"))))
        {
        }

        public ContactController(CrmManager crmManager)
        {
            _crmManager = crmManager;
        }

        // GET: api/Contact
        public IHttpActionResult Get()
        {
            return Ok(_crmManager.GetCrmContacts());
        }

        // POST: api/Contact
        public IHttpActionResult Post(CrmContact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(_crmManager.AddContact(contact));
        }

        // PUT: api/Contact/
        public IHttpActionResult Put(CrmContact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                _crmManager.UpdateContact(contact);
                return Ok();
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
        }

        // DELETE: api/Contact/[Guid]
        public IHttpActionResult Delete(string id)
        {
            Guid contactId;
            if (!Guid.TryParse(id, out contactId))
            {
                return BadRequest();
            }
            try
            {
                _crmManager.DeleteContact(contactId);
                return Ok();
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
        }
    }
}
