angular.module("ChatApp").controller("HomeCtrl", 
[ "$scope", "$http",
	function($scope, $http){
		var socket = io.connect("http://localhost:8080");
		
		$scope.nick = "";
		$scope.loggedIn = false;

		socket.on("roomlist", function(data){
			console.log(data); 
			$scope.$apply(function(){
				$scope.rooms = data;	
			})
		});

		$scope.login = function(){
			socket.emit("adduser", $scope.nick, function(available){
    			if (available){
        			// The "dabs" username is not taken!
        			$scope.loggedIn = true; 
        			socket.emit("rooms");
    			}
			});
		};
	}
]);
