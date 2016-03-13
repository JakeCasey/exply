var app = angular.module('exply', ['ui.router']);/*
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
      controller: 'MainCtrl'
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

app.factory('chats', [function(){
	var a = {chat: "this is a second chat log"};
	return a
}])


/* category service that can be injected */
app.factory('categories', [function(){


	return o;
	
}])





app.controller('MainCtrl',  ['$scope', 'categories', function($scope, categories){

	$scope.categories= categories.categories;
	
}]);


app.controller('chatListCtrl', ['$scope', '$stateParams', 'categories', function($scope, $stateParams, categories){
	$scope.category = categories.categories[$stateParams.id];

	$scope.addChatLog = function(){
		console.log($scope.category.loggedChats);
		$scope.category.loggedChats.push({
			chat: "This is a new chat log added to a category's chat object"
		});
	};
	
}]);			