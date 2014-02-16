//Login and new user
angular.module("ChatApp").controller("LoginCtrl", 
[ "$scope", "SOCKET_URL", "$location", "SocketService",

	function($scope, SOCKET_URL, $location, SocketService){
		var socket = io.connect(SOCKET_URL);
    	$scope.username = "";
	    $scope.message = "";
	    $scope.isLoggedIn = false;

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
						$scope.isLoggedIn = true; 
					}
					else {
						$scope.message = "Your name is taken, please choose another";
					}
					$scope.$apply();
				});
			}
		};

		$scope.createNewRoom = function(){
			if($scope.isLoggedIn) 
			{
				//Bý til nýtt chat
				socket.emit("joinroom", { room: $scope.newChatName, pass: "" }, function(success, errorMessage) {
					if(success === false){ $scope.message = errorMessage; }
				});
				//Set topic á nýja chattinu 
				socket.emit("settopic", { room: $scope.newChatName, topic: $scope.newChatName }, function(success, errorMessage) {
					if(success === false){ $scope.message = errorMessage; }
				});
				socket.emit("rooms");
			}			
		};
        
        // on get chat room list from chatserver
		socket.on("roomlist", function(data){
			$scope.$apply(function(){
				$scope.rooms = data;
			})
		});

	}

]);

	