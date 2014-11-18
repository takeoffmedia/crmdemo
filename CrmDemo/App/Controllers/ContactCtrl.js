angular.module('app')
.controller('ContactCtrl', ['$scope', 'contacts', 'security', function ($scope, contacts, security) {

    if (security.authenticate()) {
        //Always refresh contact list in case other user made changes
        contacts.get().then(function () {
            $scope.contacts = contacts.contacts;
        });
    }
    $scope.deleteContact = function (contact) {
        contacts.delete(contact.id);
    };

    $scope.addContact = function() {
        contacts.addNew();
    };
    
    $scope.selectContact = function (contact) {
        contacts.editContact(contact);
    };
}]);