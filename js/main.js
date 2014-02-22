
//Main, links together html views and controllers
angular.module("ChatApp").config(["$routeProvider", 
		function($routeProvider){

	$routeProvider.when("/", {
		templateUrl: "views/login.html",
		controller: "LoginCtrl",
	}).when("/roomList", {
		templateUrl: "views/roomList.html",
		controller: "RoomListCtrl",
	}).when("/room/:roomName", {
		templateUrl: "views/room.html",
		controller: "RoomCtrl",
	}).otherwise({redirectTo: "/index"});

}]);
