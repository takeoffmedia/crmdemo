angular.module('security', [])
.constant('security.urls', {
	site: '/',
	join: '/api/account/register',
	login: '/token',
	logout: '/api/account/logout'
})
.factory('security.api', ['$http', 'security.urls', function ($http, Urls) {
	//Parameterize - Necessary for funky login expectations...
	var formdataHeader = { 'Content-Type': 'application/x-www-form-urlencoded' };
	var parameterize = function (data) {
		var param = function (obj) {
			var query = '';
			var subValue, fullSubName, innerObj, i;
			angular.forEach(obj, function (value, name) {
				if (value instanceof Array) {
					for (i = 0; i < value.length; ++i) {
						subValue = value[i];
						fullSubName = name + '[' + i + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if (value instanceof Object) {
					angular.forEach(value, function (subValue, subName) {
						fullSubName = name + '[' + subName + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					});
				}
				else if (value !== undefined && value !== null) {
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
				}
			});

			return query.length ? query.substr(0, query.length - 1) : query;
		};
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	};

	var Api = {
		login: function (data) {
			return $http({ method: 'POST', url: Urls.login, data: parameterize(data), headers: formdataHeader });
		},
		logout: function () {
			return $http({ method: 'POST', url: Urls.logout });
		},
		register: function (data) {
			return $http({ method: 'POST', url: Urls.join, data: data });
		}
	};

	return Api;
}])
.provider('security', ['security.urls', function (Urls) {
	var securityProvider = this;
	//Options
	securityProvider.registerThenLogin = true;
	securityProvider.usePopups = false;
	securityProvider.urls = {
		login: '/login',
		postLogout: '/login',
		home: '/'
	};
	securityProvider.apiUrls = Urls;
	securityProvider.events = {
		login: null,
		logout: null,
		register: null,
		reloadUser: null,
		closeOAuthWindow: null
	};

	securityProvider.$get = ['security.api', '$q', '$http', '$location', '$timeout', function (Api, $q, $http, $location, $timeout) {
		//Private Variables
		var externalLoginWindowTimer = null;

		//Private Methods
		var parseQueryString = function (queryString) {
			var data = {},
				pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

			if (queryString === null) {
				return data;
			}

			pairs = queryString.split("&");

			for (var i = 0; i < pairs.length; i++) {
				pair = pairs[i];
				separatorIndex = pair.indexOf("=");

				if (separatorIndex === -1) {
					escapedKey = pair;
					escapedValue = null;
				} else {
					escapedKey = pair.substr(0, separatorIndex);
					escapedValue = pair.substr(separatorIndex + 1);
				}

				key = decodeURIComponent(escapedKey);
				value = decodeURIComponent(escapedValue);

				data[key] = value;
			}

			return data;
		};
		var accessToken = function (accessToken, persist) {
			if (accessToken) {
				if (accessToken == 'clear') {
					localStorage.removeItem('accessToken');
					sessionStorage.removeItem('accessToken');
					delete $http.defaults.headers.common.Authorization;
				} else {
					if (persist) localStorage.accessToken = accessToken;
					else sessionStorage.accessToken = accessToken;
					$http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
				}
			}
			return sessionStorage.accessToken || localStorage.accessToken;
		};
		var redirectTarget = function (newTarget) {
			if (newTarget == 'clear') {
				delete localStorage.redirectTarget;
				return;
			}
			if (newTarget) localStorage.redirectTarget = newTarget;
			return localStorage.redirectTarget;
		};
		var initialize = function () {
			//Check for access token and get user info
			if (accessToken()) {
				accessToken(accessToken());
			}
		};

		//Public Variables
		var Security = this;
		Security.user = null;
		Security.externalUser = null;
		Security.externalLogins = [];

		//Public Methods
		Security.login = function (data) {
			var deferred = $q.defer();

			data.grant_type = 'password';
			Api.login(data).success(function (user) {
				accessToken(user.access_token, data.rememberMe);
				Security.user = user;
				Security.redirectAuthenticated(redirectTarget() || securityProvider.urls.home);
				if (securityProvider.events.login) securityProvider.events.login(Security, user); // Your Login events
				deferred.resolve(Security.user);
			}).error(function (errorData) {
				deferred.reject(errorData);
			});

			return deferred.promise;
		};

		Security.logout = function () {
			var deferred = $q.defer();

			Api.logout().success(function () {
				Security.user = null;
				accessToken('clear');
				redirectTarget('clear');
				if (securityProvider.events.logout) securityProvider.events.logout(Security); // Your Logout events
				$location.path(securityProvider.urls.postLogout);
				deferred.resolve();
			}).error(function (errorData) {
				deferred.reject(errorData);
			});

			return deferred.promise;
		};

		Security.register = function (data) {
			var deferred = $q.defer();

			Api.register(data).success(function () {
				if (securityProvider.events.register) securityProvider.events.register(Security); // Your Register events
				if (securityProvider.registerThenLogin) {
					Security.login(data).then(function (user) {
						deferred.resolve(user);
					}, function (errorData) {
						deferred.reject(errorData);
					});
				} else {
					deferred.resolve();
				}
			}).error(function (errorData) {
				deferred.reject(errorData);
			});

			return deferred.promise;
		};

		Security.authenticate = function () {
			if (accessToken()) return true;
			if(!redirectTarget())redirectTarget($location.path());
			$location.path(securityProvider.urls.login);

		    return false;
		};

		Security.redirectAuthenticated = function (url) {
			if (!accessToken()) return;
			if(redirectTarget())redirectTarget('clear');
			$location.path(url);
		};

	    Security.accessToken = function() {
	        return accessToken();
	    };

		initialize();

		return Security;
	}];
}]);