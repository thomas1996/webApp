var app = angular.module('flapperNews', ['ui.router'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
   postPromise: ['posts', function(posts){
     return posts.getAll();
    }]
    }
  })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
    post: ['$stateParams', 'posts', function($stateParams, posts) {
      return posts.get($stateParams.id);
        }]
      }
    })
    .state('login', {
  url: '/login',
  templateUrl: '/login.html',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('home');
    }
  }]
})
.state('register', {
  url: '/register',
  templateUrl: '/register.html',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('home');
    }
  }]
});

  $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', ['$http', 'auth', function($http, auth){
  var o = {
    posts: []
  };

  o.getAll = function() {
  return $http.get('/posts').success(function(data){
    angular.copy(data, o.posts);
    });
  };

  o.create = function(post) {
  return $http.post('/posts', post, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
    o.posts.push(data);
  });
  };


  o.deleteAircraft = function(post){
    return $http.delete('/posts/' + post._id, {
      headers: {Authorization: 'Bearer '+ auth.getToken()}
    }).success(function(){
     // posts.splice(posts.indexOf(post), 1);
        o.getAll();
    });
  };

  o.deleteFlight = function(post, comment) {
    return $http.delete('/posts/' + post._id + '/comments/' + comment._id, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.get = function(id) {
  return $http.get('/posts/' + id).then(function(res){
    return res.data;
  });
  };

  o.addFlight = function(id, comment) {
  return $http.post('/posts/' + id + '/comments', comment, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  });
  };


return o;
}]);

app.factory('auth', ['$http', '$window', function($http, $window) {
    var auth = {};

    auth.saveToken = function (token) {
        $window.localStorage['flapper-news-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['flapper-news-token'];
    };

    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob( token.split('.')[1]) );

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    auth.register = function(user){
        return $http.post('/register', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function(){
        $window.localStorage.removeItem('flapper-news-token');
    };

    return auth;
}]);

app.controller('MainCtrl', [
'$scope',
'posts',
'auth',
function($scope, posts, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.posts = posts.posts;

$scope.addAircraft = function () {
    if ($scope.manifacture) {
        console.log(auth.currentUser());
        posts.create({
            manifacture: $scope.manifacture,
            type: $scope.type,
            callsign: $scope.callsign,
            author: auth.currentUser().username
        });

        $scope.manifacture = '';
        $scope.type = '';
        $scope.callsign = '';
    }
};
$scope.deleteAircraft = function(post){
  posts.deleteAircraft(post).error(function(error){
    $scope.error = error;
  });
};
$scope.showDeletePost = function(post){
  post.author._id == auth.currentUserId();
};

$scope.canDelete = function (post) {
    return post.author === auth.currentUser();


}

}]);

app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
function($scope, posts, post, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.post = post;

  $scope.addFlight = function(){
  posts.addFlight(post._id, {
      pilot: auth.currentUser(),
      landings: $scope.landings,
      houres: $scope.houres
 }).error(function(error){
   $scope.error = error;
 }).success(function(comment) {
   $scope.post.flights.push(comment);
 });
      $scope.pilot = '';
      $scope.landings='';
      $scope.houres = '';
};

$scope.deleteFlight = function(flight){
    console.log(flight);
  posts.deleteFlight(post, flight).error(function(error){
    $scope.error = error;
  }).success(function(){
    post.flights.splice(post.flights.indexOf(flight), 1);
  });
};

$scope.showDeleteComment = function(post){
  post.author._id == auth.currentUserId();
};

$scope.canDelete = function (comment) {
    console.log(comment);
        return comment.pilot === auth.currentUser();
    }
}]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);
