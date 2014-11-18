angular.module('contacts', ['security'])
.constant('contacts.urls', {
    site: '/',
    contact: '/api/Contact'
})
    .factory('contacts.api', ['$http', 'contacts.urls', 'security', function ($http, urls, security) {

        var Api = {
            getContacts: function () {
                return $http({ url: urls.contact, method: 'GET', headers: { 'Authorization': 'Bearer ' + security.accessToken() } });
            },
            addContact: function (contact) {
                return $http({ url: urls.contact, method: 'POST', data: contact, headers: { 'Authorization': 'Bearer ' + security.accessToken() } });
            },
            editContact: function (contact) {
                return $http({ url: urls.contact + "/" + contact.id, method: 'PUT', data: contact, headers: { 'Authorization': 'Bearer ' + security.accessToken() } });
            },
            deleteContact: function (id) {
                return $http({ url: urls.contact + "/" + id, method: 'DELETE', headers: { 'Authorization': 'Bearer ' + security.accessToken() } });
            }
        };
        return Api;
    }])
    .provider('contacts', [function () {
        var contactProvider = this;

        contactProvider.$get = ['contacts.api', '$q', '$http', 'security', '$location', function (Api, $q, $http, security, $location) {

            var Contacts = this;

            Contacts.contacts = function () {
                return contactProvider.contacts;
            };

            Contacts.get = function () {
                var deferred = $q.defer();
                Api.getContacts().success(function (data) {
                    contactProvider.contacts = data;
                    deferred.resolve();
                }).error(function (errorData) {
                    deferred.reject(errorData);
                });
                return deferred.promise;
            };

            Contacts.contactToEdit = function() {
                return contactProvider.toEdit;
            };
            

            Contacts.addNew = function () {
                $location.path('/add');
            };

            Contacts.editContact = function (contact) {
                contactProvider.toEdit=angular.copy(contact);
                $location.path('/edit');
            };

            Contacts.goToList = function () {
                $location.path('/');
            };

            Contacts.add = function (contact) {
                var deferred = $q.defer();
                Api.addContact(contact).success(function (contactId) {
                    contact.id = JSON.parse(contactId);
                    contactProvider.contacts.push(contact);
                    $location.path('/');
                    deferred.resolve();
                }).error(function (errorData) {
                    deferred.reject(errorData);
                });

                return deferred.promise;
            };

            Contacts.edit = function (editedContact) {
                var deferred = $q.defer();
                Api.editContact(editedContact).success(function () {
                    for (var i = 0; i < contactProvider.contacts.length; i++) {
                        var contact = contactProvider.contacts[i];
                        if (editedContact.id == contact.id) {
                            contactProvider.contacts[i] = editedContact;
                        }
                    }
                    $location.path('/');
                    deferred.resolve();
                }).error(function (errorData) {
                    deferred.reject(errorData);
                });

                return deferred.promise;
            };

            Contacts.delete = function (id) {
                var deferred = $q.defer();

                Api.deleteContact(id).success(function () {
                    for (var i = 0; i < contactProvider.contacts.length; i++) {
                        var contact = contactProvider.contacts[i];
                        if (contact.id == id) {
                            contactProvider.contacts.splice(i, 1);
                        }
                    }
                    deferred.resolve();
                }).error(function (errorData) {
                    deferred.reject(errorData);
                });

                return deferred.promise;
            };

            return Contacts;
        }];
    }]);