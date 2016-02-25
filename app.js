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

	var o =  {

		categories:	[
		{ title: "Science", activeChatCount: 0, loggedChats:
		[{chat: "this is a chat log"}], activeChats: [{chat: "this is an active chat room"}]
		 }, 
		{ title: "Math", activeChatCount: 0, loggedChats:
		[{chat: "this is a chat log"}, {chat: "this is a chat log"}], activeChats: [{chat: "this is an active chat room"}]
		 }, 
		{ title: "History", activeChatCount: 0, loggedChats:
		[{chat: "this is a chat log"}, {chat: "this is a chat log"}], activeChats: [{chat: "this is an active chat room"}]
		 }, 
		{ title: "Geography", activeChatCount: 0, loggedChats:
		[{chat: "this is a chat log"}, {chat: "this is a log for Geography"}], activeChats: [{chat: "this is an active chat room"}]
		 }, 
		]

	};

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