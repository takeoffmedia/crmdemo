using System;
using System.Collections.Generic;
using System.Linq;
using CrmDemo.Models;
using Xrm;

namespace CrmDemo.Services
{
    public class CrmManager
    {
        private readonly XrmServiceContext _context;

        public CrmManager(XrmServiceContext context)
        {
            _context = context;
        }

        public IEnumerable<CrmContact> GetCrmContacts()
        {
            return _context.ContactSet.Select(c => new CrmContact
            {
                Email = c.EMailAddress1,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Id = c.Id
            }).ToList();
        }

        public Guid AddContact(CrmContact contact)
        {
            if (_context.ContactSet.FirstOrDefault(c => c.EMailAddress1 == contact.Email) != null)
            {
                throw new ArgumentException("Contact with the same email already exist");
            }

            var crmContact = new Contact
            {
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                EMailAddress1 = contact.Email
            };
            _context.AddObject(crmContact);
            _context.SaveChanges();

            contact.Id = crmContact.Id;

            return crmContact.Id;
        }

        public void UpdateContact(CrmContact contact)
        {
            var contactToUpdate = GetContactById(contact.Id);

            contactToUpdate.FirstName = contact.FirstName;
            contactToUpdate.LastName = contact.LastName;
            contactToUpdate.EMailAddress1 = contact.Email;

            _context.UpdateObject(contactToUpdate);
            _context.SaveChanges();
        }

        public void DeleteContact(Guid contactId)
        {
            var contactToDelete = GetContactById(contactId);

            _context.DeleteObject(contactToDelete);
            _context.SaveChanges();
        }

        private Contact GetContactById(Guid contactId)
        {
            var contact = _context.ContactSet.FirstOrDefault(c => c.Id == contactId);
            if (contact == null)
            {
                throw new InvalidOperationException("Specified contact could not be found");
            }
            return contact;
        }
    }
}