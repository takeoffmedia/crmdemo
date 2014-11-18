using System;
using System.Linq;
using CrmDemo.Models;
using Microsoft.Xrm.Client.Services;
using NUnit.Framework;
using CrmDemo.Services;
using Xrm;

namespace CrmDemo.Tests
{
    [TestFixture]
    public class CrmManagerTests
    {
        private CrmManager _crmManager;

        [TestFixtureSetUp]
        public void Setup()
        {
            _crmManager = new CrmManager(new XrmServiceContext(new OrganizationService("Crm")));
        }

        [TestFixtureTearDown]
        public void Teardown()
        {
            var testContacts = _crmManager.GetCrmContacts().Where(c => c.Email.EndsWith("domain.test")).ToList();

            foreach (var testContact in testContacts)
            {
                _crmManager.DeleteContact(testContact.Id);
            }
        }

        [Test]
        public void AddContact_should_add_contact_if_not_exist()
        {
            var id = _crmManager.AddContact(new CrmContact
            {
                FirstName = "John",
                LastName = "Smith",
                Email = "test1@domain.test"
            });

            Assert.IsTrue(Guid.Empty != id);
        }

        [Test]
        public void AddContact_should_throw_exception_if_mail_exist()
        {
            var contactToAdd = new CrmContact
            {
                FirstName = "John",
                LastName = "Smith",
                Email = "test2@domain.test"
            };

            var id = _crmManager.AddContact(contactToAdd);
            Assert.IsTrue(Guid.Empty != id);

            Assert.Throws<ArgumentException>(() => _crmManager.AddContact(contactToAdd));
        }

        [Test]
        public void GetCrmContacts_should_return_all_accounts()
        {
            var id = _crmManager.AddContact(new CrmContact
            {
                FirstName = "John",
                LastName = "Smith",
                Email = "test3@domain.test"
            });

            var list = _crmManager.GetCrmContacts();

            Assert.IsNotNull(list);
            Assert.IsTrue(list.Any(c => c.Id == id));
        }

        [Test]
        public void UpdateContact_should_update_contact_exist()
        {
            var contactToEdit = new CrmContact
            {
                FirstName = "John",
                LastName = "Smith",
                Email = "test4@domain.test"
            };

            var id = _crmManager.AddContact(contactToEdit);

            contactToEdit.LastName = "Doe";
            _crmManager.UpdateContact(contactToEdit);

            var editedContact = _crmManager.GetCrmContacts().FirstOrDefault(c => c.Id == id);

            Assert.IsNotNull(editedContact);
            Assert.AreEqual(editedContact.LastName, "Doe");
        }

        [Test]
        public void UpdateContact_should_throw_exception_if_not_exist()
        {
            var contactToEdit = new CrmContact
            {
                FirstName = "John",
                LastName = "Smith",
                Email = "test5@domain.test"
            };

            Assert.Throws<InvalidOperationException>(() => _crmManager.UpdateContact(contactToEdit));
        }

        [Test]
        public void DeleteContact_should_delete_contact_if_exist()
        {
            var contactToDelete = new CrmContact
            {
                FirstName = "John",
                LastName = "Smith",
                Email = "test6@domain.test"
            };

            var id = _crmManager.AddContact(contactToDelete);

            _crmManager.DeleteContact(id);

            var deletedContact = _crmManager.GetCrmContacts().FirstOrDefault(c => c.Id == id);

            Assert.IsNull(deletedContact);
        }

        [Test]
        public void DeleteContact_should_throw_exception_if_not_exist()
        {
            Assert.Throws<InvalidOperationException>(() => _crmManager.DeleteContact(Guid.NewGuid()));
        }
    }
}
