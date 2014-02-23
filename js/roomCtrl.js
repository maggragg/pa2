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
        $scope.users = [];
        $scope.showBanKick = false; 

		var socket = SocketService.getSocket();
		var privateMsgUser = "";
		var roomTopic = $routeParams.roomName;

        $("#chatMessage").hide();

		if(socket) {
			// join the room 
			if($scope.roomName !== ""){
				socket.emit("joinroom", { room: $scope.roomName, pass: "" }, function(success, errorMessage) {
					if(success === false){ 
						$scope.message = "You could not join this chat room!"; 
					}
					$scope.$apply();
				});
			}

			// get all messages on the chat
			socket.on("updatechat", function(roomname, messageHistory) {
				$scope.messages = messageHistory;
				$scope.$apply();
			});

			// get all users logged in 
			// show/hide admin menu
			socket.on("updateusers", function(room, users, ops) {
				if(room === $scope.roomName) {
					$scope.users = users;
					
					if(ops !== undefined && ops[SocketService.getUsername()] === SocketService.getUsername()){
						$scope.showBanKick = true; 
					}
					else{
						$scope.showBanKick = false; 
					}
					$scope.$apply();
				}
			});

			// user reciveing private message from another user
			socket.on("recv_privatemsg", function(userTo, message){
				$scope.alerts.push({msg: message, usr: userTo});
				$scope.$apply();
			});

			socket.on("updatetopic", function(room, topic, user){
				$routeParams.roomName = topic;
				$scope.newTopic = "";
				$scope.poppUpMessage = "Topic has been changed to " + topic;
				$scope.$apply();
			});

			// user beeing kicked from the room by operator of a room
			socket.on("kicked", function(kickedRoom, kickedUser, userName){
				if (SocketService.getUsername() === kickedUser){
					$location.path("/roomList");
				}
				else if (SocketService.getUsername() !== userName){
					$scope.poppUpMessage = kickedUser + " has been kicked from the chat room by" + userName + "!";
					$scope.$apply();
					$("#chatMessage").show();
					$("#chatMessage").fadeOut(4000);
				}

			});

			// user beeing banned from the room by operator of a room
			socket.on("banned", function(banRoom, banUser, userName){
				if (SocketService.getUsername() === banUser){
					$location.path("/roomList");
				}
				else if (SocketService.getUsername() !== userName){
					$scope.poppUpMessage = banUser + " has been banned from the chat room by" + userName +  "!";
					$scope.$apply();
					$("#chatMessage").show();
					$("#chatMessage").fadeOut(4000);
				}
			});

			// server messages handled
			socket.on("servermessage", function(msgType, room, userAfected){
				if(SocketService.getUsername() !== userAfected && room === roomTopic){
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

		// when alert message is closed remove the alert item from tha alert array
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		// send message to the chat
		$scope.send = function() {
			if(socket) {
				socket.emit("sendmsg", { roomName: $scope.roomName, msg: $scope.currentMessage });
				$scope.currentMessage = "";
			}
		};

		// handles enter key, call send message 
		$scope.keyPress = function($event) {
			if($event.keyCode === 13) {
				$scope.send();
			}
		};

		// set the user wich is supposed to recieve the private message
		$scope.setPrivateMsgUser = function(userName){
			if(socket) {
				$scope.privateMsgUser = userName;
			}
		};

		// send private message
		$scope.sendPrivateMessage = function(){
			if(socket) {
				socket.emit("privatemsg", { nick: $scope.privateMsgUser, message: $scope.privateMessage }, function(success){
					if(success === false){ $scope.message = "Not possible to send private message!"; } 
				});
				$scope.privateMsgUser = "";
				$('#privateMsgModal').modal('hide');
			}
		};

		// log out from a chat room
		$scope.leaveRoom = function() {
			if(socket) {
				socket.emit("partroom", $scope.roomName);
				$location.path("/roomList");
			}
		};

		// kcik user from a chat room
		$scope.kickUser = function(userName) {
			if(socket) {
				socket.emit("kick", {user: userName, room: $scope.roomName}, function(allowed) {
					if(allowed === false){ $scope.message = "You cannot kick this user from the chat room!";
					}
				});
			}
		};

		// ban user from a chat room
		$scope.banUser = function(userName) {
			if(socket) {
				socket.emit("ban", {user: userName, room: $scope.roomName}, function(allowed) {
					if(allowed === false){ $scope.message = "You cannot ban this user for the chat room!";
					}
				});
			}
		};

		$scope.changeTopic = function() {
			if(socket) {
				socket.emit("settopic", {room: $scope.roomName, topic: $scope.newTopic}, function(allowed) {
					if(allowed === false){ $scope.message = "You cannot change topic on this room!";
					}
				console.log("Topic changed to " + $scope.newTopic);

				});
			}
		};


	}
]);

