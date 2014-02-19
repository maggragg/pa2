//Login and new user
angular.module("ChatApp").controller("RoomListCtrl", 
[ "$scope", "SOCKET_URL", "$location", "SocketService",

	function($scope, SOCKET_URL, $location, SocketService){
		var socket = io.connect(SOCKET_URL);
		$scope.username = "";
		$scope.message = "";

		// If the user is logged in
        // on get chat room list from chatserver
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
        
	}

]);

	