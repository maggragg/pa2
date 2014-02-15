
//Main, links together html views and controllers
angular.module("ChatApp")
.config(function($routeProvider){

	$routeProvider.when("/index", {
		templateUrl: "/views/home.html",
		controller: "HomeCtrl"
	}).when("/rooms/:roomid", {
		templateUrl: "/views/room.html", 
		controller: "RoomCtrl"
	}).otherwise({redirectTo: "/index"});
});
