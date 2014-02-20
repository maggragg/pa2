//Login and new user
angular.module("ChatApp").controller("LoginCtrl", 
[ "$scope", "SOCKET_URL", "$location", "SocketService",

	function($scope, SOCKET_URL, $location, SocketService){
		var socket = io.connect(SOCKET_URL);
    	$scope.username = "";
	    $scope.message = "";

		$scope.connect = function() 
		{
			if(socket) 
			{
				socket.emit("adduser", $scope.username, function(available) {
					if(available) {
						SocketService.setConnected(socket);
						SocketService.setUsername($scope.username);
						//redirect to roomList 
						$location.path("/roomList");
					}
					else {
						$scope.message = "Your name is taken, please choose another";
					}
					$scope.$apply();
				});
			}
		};

	}

]);

	