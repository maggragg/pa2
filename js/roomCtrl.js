//Chat controller
angular.module("ChatApp").controller("RoomCtrl", 
[ "$scope", "$routeParams", "$location", "SocketService",  
	function($scope, $routeParams, $location, SocketService){

		$scope.roomName = $routeParams.roomName;
		$scope.currentMessage = "";
		$scope.userInRoom = SocketService.getUsername();
		$scope.alerts = [];	 
        $scope.poppUpMessage = "";
        $scope.privateMsgUser = "";
        $("#chatMessage").hide();

		var socket = SocketService.getSocket();
		var privateMsgUser = "";

		if(socket) {
			if($scope.roomName !== ""){
				socket.emit("joinroom", { room: $scope.roomName, pass: "" }, function(success, errorMessage) {
					if(success === false){ $scope.message = "You could not join this chat room!"; }
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

			socket.on("recv_privatemsg", function(userTo, message){
				$scope.alerts.push({msg: message, usr: userTo});
				$scope.$apply();
			});

			socket.on("kicked", function(kickedRoom, kickedUser, userName){
				if (SocketService.getUsername() === kickedUser){

					$scope.popUpMessage = "You have been kicked from this chat by " + userName + "!";
					$location.path("/roomList");
				}
				else{
					$scope.poppUpMessage = kickedUser + " has been kicked from the chat room by " + userName +  " !";

				}
				$scope.$apply();
				$("#chatMessage").show();
				$("#chatMessage").fadeOut(4000);
			});

			socket.on("banned", function(banRoom, banUser, userName){
				if (SocketService.getUsername() === banUser){
					$scope.poppUpMessage = "You have been banned from this chat by " + userName + "!";
					$location.path("/roomList");
				}
				else{
					$scope.poppUpMessage = banUser+ " has been banned from the chat room by " + userName +  " !";
				}
				$scope.$apply();
				$("#chatMessage").show();
				$("#chatMessage").fadeOut(4000);
			});

			socket.on("servermessage", function(msgType, room, userAfected){
				if(SocketService.getUsername() !== userAfected){
					if (msgType === "join"){
						$scope.poppUpMessage = userAfected + " has joined the chat room!";
					}
					else if(msgType === "part"){
						$scope.poppUpMessage = userAfected + " has left the chat room!";
					}
					else if(msgType === "quit"){
						$scope.poppUpMessage = userAfected + " has left the chat!";
					}
					$scope.$apply();
					$("#chatMessage").show();
					$("#chatMessage").fadeOut(4000);
				}
			});
		}

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

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
			}
		};

		$scope.sendPrivateMessage = function(){
			if(socket) {
				socket.emit("privatemsg", { nick: $scope.privateMsgUser, message: $scope.privateMessage }, function(success){
					if(success === false){ $scope.message = "Not possible to send private message!"; } 
				});
				$scope.privateMsgUser = "";
				$('#privateMsgModal').modal('hide');
			}
		};

		$scope.leaveRoom = function() {
			if(socket) {
				socket.emit("partroom", $scope.roomName);
				$location.path("/roomList");
			}
		};

		$scope.kickUser = function(userName) {
			if(socket) {
				socket.emit("kick", {user: userName, room: $scope.roomName}, function(allowed) {
					if(allowed === false){ $scope.message = "You cannot kick this user from the chat room!";
					}
				});
			}
		};

		$scope.banUser = function(userName) {
			if(socket) {
				socket.emit("ban", {user: userName, room: $scope.roomName}, function(allowed) {
					if(allowed === false){ $scope.message = "You cannot ban this user for the chat room!";
					}
				});
			}
		};

	}
]);

