//Global module
//Declares the angular application and it's dependencies
angular.module("ChatApp", ["ng", "ngRoute"]);

//System constants 
angular.module("ChatApp").constant("SOCKET_URL", "http://localhost:8080");

//Socket connection and current suer
angular.module("ChatApp").factory("SocketService", ["$http", function($http) {
	var username = "";
	var socket;
	var chatRoom;
	return {
		setConnected: function(theSocket) {
			socket = theSocket;
		},
		setUsername: function(user) {
			username = user;
		},
		getUsername: function() {
			return username;
		},
		getSocket: function() {
			return socket;
		}, 
	};
}]);

