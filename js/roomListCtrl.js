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

			// server sending roomlist
			socket.on("roomlist", function(roomList) {
				$scope.roomList = [];
				$scope.rooms = roomList;
				$scope.$apply();
			});

			// server message join handled to get new room list 
			socket.on("servermessage", function(msgType, room, userAfected){
				if(SocketService.getUsername() !== userAfected){
					if (msgType === "join"){
						socket.emit("rooms");
					}
				}
			});

		}
		else {
			$location.path("/");
		}

		// create new room
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
        
        // leave chat room
		$scope.logOut = function(){
			if(socket)
			{
				socket.emit("logout");
				$location.path("/");
			}
		};
	}

]);

	