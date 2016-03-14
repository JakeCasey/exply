var app = angular.module('exply', ['ui.router','btford.socket-io']);/*
* exply Module
*
* Description
*/

app.config([

'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'socketCtrl',
      resolve: {
      	catPromise: ['categories', function(categories){
      		return categories.getAll();
      	}]
      }
    });

     $stateProvider
    .state('chatList', {
      url: '/{id}/loglist',
      templateUrl: '/chatList.html',
      controller: 'chatListCtrl'
    });
         $stateProvider
    .state('activeChatList', {
      url: '/{id}/activelist',
      templateUrl: '/activeChatList.html',
      controller: 'chatListCtrl'
    });

  $urlRouterProvider.otherwise('home');
}]);

app.factory('socket', function (socketFactory) {
  return socketFactory({
  			prefix: '',
            ioSocket: io.connect('http://localhost:3000')
        });
});

var message = []

app.controller('socketCtrl', ['socket','$scope', function(socket, $scope){
	$scope.messages = [];

        socket.on('connect', function () {

            socket.on('sendchat2', function(data) {
                $scope.messages.push(data);
                console.log($scope.messages)
            });

        });

	
		
  }])


/* category service that can be injected */
app.factory('categories', ['$http', function($http){

	var o =  { };

	o.getAll = function() {
		return $http.get('/categories').success(function(data){
			console.log(data[0])
			angular.copy(data[0], o);
			console.log(o)
		});
	};

	return o;
	
}])





app.controller('MainCtrl',  ['$scope', 'categories', function($scope, categories){

	$scope.categories = categories;
	console.log(categories.categories)
	
	
}]);


app.controller('chatListCtrl', ['$scope', '$stateParams', 'categories', function($scope, $stateParams, categories){
	$scope.category = categories.categories[$stateParams.id];

	$scope.addChatLog = function(){
		//console.log($scope.category.loggedChats);
		$scope.category.loggedChats.push({
			chat: "This is a new chat log added to a category's chat object"
		});
	};
	
}]);











		