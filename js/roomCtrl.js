//Chat controller
angular.module("ChatApp").controller("RoomCtrl", 
[ "$scope", "$routeParams", "$location", "SocketService",  
	function($scope, $routeParams, $location, SocketService){

		$scope.roomName = $routeParams.roomName;
		$scope.currentMessage = "";
		$scope.userInRoom = SocketService.getUsername();
		$scope.alerts = [];	 
        $scope.userName = "";
        $scope.popUpMessage = "";

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

			socket.on("recv_privatemsg", function(userTo, message){
				$scope.alerts.push({msg: message, usr: userTo});
				$scope.$apply();
			});

			socket.on("kicked", function(room, user, op){
				console.log(op + " kicked " + user + " from " + room);
				//$location.path("/roomList");
			});

			socket.on("banned", function(room, user, op){
				console.log(op + " banned " + user + " from " + room);
				//$location.path("/roomList");
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
					else if(msgType === "banned"){
						$scope.popUpMessage = "You have been banned from the chat!";
					}
					//$scope.$apply();
				}
				// Poppa upp litlum glugga með skilaboðum um notanda sem hefur joinað, yfirgefið eða verið bannaður frá chatti 
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
					if(success === false){ $scope.message = errorMessage; } 
				});
				$scope.privateMsgUser = "";
				$('#privateMsgModal').modal('hide');
			}
		};

		$scope.leaveRoom = function() {
			if(socket) {
				socket.emit("partroom", $scope.roomName);
				$location.path("/roomList");
				console.log("LeaveRoom");
			}
		};
		$scope.kickUser = function(userName) {
			if(socket) {
				socket.emit("kick", {user: userName, room: $scope.roomName}, function(allowed) {
					if(allowed === false){ $scope.message = errorMessage;
					console.log($scope.message);
					}
				});
				console.log("kickUser: " + userName);
			}
		};

		$scope.banUser = function(userName) {
			if(soceket) {
				socket.emit("ban", {user: userName, room: $scope.roomName}, function(allowed) {
					if(allowed === false){ $scope.message = errorMessage;
					console.log($scope.message);
					}
				});
				console.log("banUser: " + userName);
			}
		};

	}
]);

