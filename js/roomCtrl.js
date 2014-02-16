//Chat controller
angular.module("ChatApp").controller("RoomCtrl", 
[ "$scope", "$routeParams", "SocketService",  
	function($scope, $routeParams, SocketService){

		$scope.roomName = $routeParams.roomName;
		$scope.currentMessage = "";

		var socket = SocketService.getSocket();

		if(socket) {
			if($scope.roomName !== ""){
				socket.emit("joinroom", { room: $scope.roomName, pass: "" }, function(success, errorMessage) {
					if(success === false){ $scope.message = errorMessage; }
				});
			}

			socket.on("updatechat", function(roomname, messageHistory) {
				$scope.messages = messageHistory;
				$scope.$apply();
			});

			socket.on("updateusers", function(room, users) {
				if(room === $scope.roomName) {
					$scope.users = users;
  					$scope.$apply();
				}
			});
		}

		$scope.send = function() {
			if(socket) {
				socket.emit("sendmsg", { roomName: $scope.roomName, msg: $scope.currentMessage });
				$scope.currentMessage = "";
			}
		};

		$scope.keyPress = function($event) {
			if($event.keyCode === 13) {
				$scope.send();
			}
		};

	}
]);

