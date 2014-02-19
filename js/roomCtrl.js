//Chat controller
angular.module("ChatApp").controller("RoomCtrl", 
[ "$scope", "$routeParams", "$location", "SocketService",  
	function($scope, $routeParams, $location, SocketService){

		$scope.roomName = $routeParams.roomName;
		$scope.currentMessage = "";
		$scope.userInRoom = SocketService.getUsername();
		$scope.userName = "";

		var socket = SocketService.getSocket();
		var privateMsgUser = "";

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
					$scope.userInRoom = SocketService.getUsername();
					$scope.$apply();
				}
			});

			socket.on("recv_privatemsg", function(user, message){
				console.log("Getting private message");
				console.log(message);
			});

			socket.on("serverMessage", function(msgType, room, userAfected){
				if (SocketService.getUsername() !== userAfected){

					if (msgType === "join"){
						$scope.popUpMessage = userAfected + " has joined the chat room!";
					}
					else if(msgType === "part"){
						$scope.popUpMessage = userAfected + " has left the chat room!";
					}
					else if(msgType === "quit"){
						$scope.popUpMessage = userAfected + " has left the chat!";
					}
					else if(msgType === "kicked"){
						$scope.popUpMessage = userAfected + "was kicked from the chat room!";
					}
					else if(msgType === "banned"){
						$scope.popUpMessage = userAfected + "was banned from the chat room!";
					}
					//$scope.$apply();
				}	
				else if(SocketService.getUsername() === userAfected)
				{ 
					if(msgType === "kicked"){
						$scope.popUpMessage = "You have been kicked out of the chat!";
					}
					//$scope.$apply();
				}
				// Poppa upp litlum glugga með skilaboðum um notanda sem hefur joinað, yfirgefið eða verið bannaður frá chatti 
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

		$scope.setPrivateMsgUser = function(userName){
			if(socket) {
				$scope.privateMsgUser = userName;
				console.log("Set private msg user");
				console.log($scope.privateMsgUser);
			}
		};

		$scope.sendPrivateMessage = function(){
			//if(socket) {
			//	console.log("Sending private message");
			//	console.log($scope.privateMessage);
			//	console.log($scope.privateMsgUser);
			//	socket.emit("privatemsg", { nick: $scope.privateMsgUser, message: $scope.privateMessage }, function(success));
			//	$scope.privateMessage = "";
			//	$scope.privateMsgUser = "";
			//	$('#privateMsgModal').modal('hide');
			//}
		};

		$scope.leaveRoom = function() {
			if(socket) {
				socket.emit("partroom", $scope.roomName);
				$location.path("/roomList");
			}
		};

		$scope.kickUser = function() {
			if(socket) {
				socket.emit("kick", {user: $scope.userName, room: $scope.roomName}, function(allowed) {
					if(allowed === false){ $scope.message = errorMessage; }
				});
				console.log("kickUser");
			}
		}

		$scope.banUser = function() {
			if(soceket) {
				socket.emit("ban", {user: $scope.userName, room: $scope.roomName}, function(allowed) {
					if(allowed === false){ $scope.message = errorMessage; }
				});
				console.log("kickUser");
			}
		}
	}
]);

