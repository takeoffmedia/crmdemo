angular.module('app')
.controller('AddCtrl', ['$scope', 'contacts','security', function ($scope, contacts,security) {
    security.authenticate()
    
    $scope.addContact = function(contact) {
        contacts.add(angular.copy(contact)).then(function() {
            $scope.contactToAdd = {};
            $scope.addContactForm.$setPristine();
        });
    };

    $scope.cancel = function() {
        contacts.goToList();
    };
}]);