//Login and new user
angular.module("ChatApp").controller("HomeCtrl", 
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
                        //Get chat room list
						socket.emit("rooms");

						console.log("logged in");
					}
					else {
						$scope.message = "Your name is taken, please choose another";
					}
					$scope.$apply();
				});
			}
		};
        
        // on get chat room list
		socket.on("roomlist", function(data){
			$scope.$apply(function(){
				$scope.rooms = data;
				
				console.log(data);	
			})
		});

	}

]);

	