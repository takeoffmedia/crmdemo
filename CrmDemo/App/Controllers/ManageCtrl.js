﻿angular.module('app')
.controller('ManageCtrl', ['$scope', 'security', function ($scope, Security) {
	Security.authenticate();

	var ChangePasswordModel = function () {
		return {
			oldPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	};

	$scope.changingPassword = null;
	$scope.changePassword = function () {
		$scope.changingPassword = new ChangePasswordModel();
	}
	$scope.cancel = function () {
		$scope.changingPassword = null;
	}
	$scope.updatePassword = function () {
		if (!$scope.manageForm.$valid) return;
		var newPassword = angular.copy($scope.changingPassword);
		$scope.changingPassword = null;
		Security.changePassword(newPassword).then(function () {
			//Success
		}, function () {
			//Error
			$scope.changingPassword = newPassword;
		});
	}
	$scope.changePasswordSchema = [
		{ property: 'oldPassword', type: 'password', attr: { required: true } },
		{ property: 'newPassword', type: 'password', attr: { ngMinlength: 4, required: true } },
		{ property: 'confirmPassword', type: 'password', attr: { confirmPassword: 'changingPassword.newPassword', required: true } }
	];
}]);