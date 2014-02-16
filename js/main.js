
//Main, links together html views and controllers
angular.module("ChatApp")
.config(function($routeProvider){

	$routeProvider.when("/index", {
		templateUrl: "/views/login.html",
		controller: "LoginCtrl"
	}).when("/rooms/:roomName", {
		templateUrl: "/views/room.html", 
		controller: "RoomCtrl"
	}).otherwise({redirectTo: "/index"});
});
