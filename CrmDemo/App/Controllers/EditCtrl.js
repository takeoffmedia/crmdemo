angular.module('app')
.controller('EditCtrl', ['$scope', 'contacts', 'security', function ($scope, contacts, security) {
    security.authenticate();

    $scope.contactToEdit = contacts.contactToEdit();

    $scope.editContact = function (contact) {
        contacts.edit(contact).then(function () {
            $scope.contactToEdit = {};
            $scope.editContactForm.$setPristine();
        });
    };

    $scope.cancel = function () {
        contacts.goToList();
    };
}]);