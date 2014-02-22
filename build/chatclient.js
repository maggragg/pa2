//Global module
//Declares the angular application and it's dependencies
angular.module("ChatApp", ["ng", "ngRoute"]);

//System constants 
angular.module("ChatApp").constant("SOCKET_URL", "http://localhost:8080");


angular.module("ChatApp").factory("SocketService", ["$http", function($http) {
	var username = "";
	var socket;
	var chatRoom;
	return {
		setConnected: function(theSocket) {
			socket = theSocket;
		},
		setUsername: function(user) {
			username = user;
		},
		getUsername: function() {
			return username;
		},
		getSocket: function() {
			return socket;
		}, 
	};
}]);


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

	

//Main, links together html views and controllers
angular.module("ChatApp")
.config(function($routeProvider){

	$routeProvider.when("/", {
		templateUrl: "views/login.html",
		controller: "LoginCtrl",
	}).when("/roomList", {
		templateUrl: "views/roomList.html",
		controller: "RoomListCtrl",
	}).when("/room/:roomName", {
		templateUrl: "views/room.html",
		controller: "RoomCtrl",
	}).otherwise({redirectTo: "/index"});
});

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

        $("#chatMessage").hide();

		if(socket) {
			// join the room 
			if($scope.roomName !== ""){
				socket.emit("joinroom", { room: $scope.roomName, pass: "" }, function(success, errorMessage) {
					if(success === false){ 
						$scope.message = "You could not join this chat room!"; 
					}
					$scope.$apply();
					console.log("");
					console.log($scope.showBanKick);
				});
			}

			// get all messages on the chat
			socket.on("updatechat", function(roomname, messageHistory) {
				$scope.messages = messageHistory;
				$scope.$apply();
			});

			// get all users logged in 
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
					console.log("");
					console.log($scope.showBanKick);
				}
			});

			// user reciveing private message from another user
			socket.on("recv_privatemsg", function(userTo, message){
				$scope.alerts.push({msg: message, usr: userTo});
				$scope.$apply();
			});

			// user beeing kicked from the room by operator of a room
			socket.on("kicked", function(kickedRoom, kickedUser, userName){
				if (SocketService.getUsername() === kickedUser){
					$scope.poppUpMessage = "You have been kicked from this chat by " + userName + "!";
					$location.path("/roomList");
				}
				else{
					$scope.poppUpMessage = kickedUser + " has been kicked from the chat room by" + userName + "!";
				}

				$scope.$apply();
				$("#chatMessage").show();
				$("#chatMessage").fadeOut(4000);
			});

			// user beeing banned from the room by operator of a room
			socket.on("banned", function(banRoom, banUser, userName){
				if (SocketService.getUsername() === banUser){
					$scope.poppUpMessage = "You have been banned from this chat by " + userName + "!";
					$location.path("/roomList");
					$location.path("/roomList");
				}
				else{
					$scope.poppUpMessage = banUser + " has been banned from the chat room by" + userName +  "!";
				}
				$scope.$apply();
				$("#chatMessage").show();
				$("#chatMessage").fadeOut(4000);
			});

			// server messages handled
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

		// when alert message is closed remove the alert tiem from tha alert array
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

		// handles enter key, calls send message 
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

	}
]);


//Login and new user
angular.module("ChatApp").controller("RoomListCtrl", 
[ "$scope", "SOCKET_URL", "$location", "SocketService",

	function($scope, SOCKET_URL, $location, SocketService){
		var socket = io.connect(SOCKET_URL);
		$scope.username = "";
		$scope.message = "";

		// If the user is logged in
        // get chat room list from chatserver
		if(socket) {
			socket.emit("rooms");

			socket.on("roomlist", function(roomList) {
				$scope.roomList = [];
				$scope.rooms = roomList;
				$scope.$apply();
			});
		}
		else {
			$location.path("/");
		}

		$scope.createNewRoom = function(){
			if(socket) 
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
        
		$scope.logOut = function(){
			if(socket)
			{
				//log out
				socket.emit("disconnect");
				console.log("logOut");
				$location.path("/");
			}
		};
	}

]);

	