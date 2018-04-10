var App = angular.module('app', ['ui.router']);  //实例化angular  引入ui-router
App.controller('mycon', ['$scope', 'reqs', function ($scope, reqs) {//引入reqs服务  
    $scope.title = "this is title";//挂载数据
    reqs.getData('http://localhost:8087/data').then((res) => { console.log(res); $scope.data = res })//then 第一个函数是成功回调，可以把数据挂载到$scope上  页面就会显示数据了
    $scope.head = {
        title: "this is head"
    }

}])

//自定义服务  这个服务是用来请求数据的名称为reqs
App.factory('reqs', ['$http', '$q', function ($http, $q) {//引入$htpp 与$q  服务  
    return {//服务返回一个对象，  调用的时候  reqs.getData('路径')
        getData: function (urls) {
            var defer = $q.defer();
            $http({
                url: urls
            }).success(function (res) {
                defer.resolve(res)
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    }
}])


//组件传值  父子组件通信  重要是scope  childData ：'='
App.directive('child', function () {
    return {
        restrict: 'E',
        scope: {
            childData: '='//双向绑定  这样父子通用一个数据
        },
        templateUrl: '../view/child.html'
    }
})


//路由传参 及请求数据
App.config(['$stateProvider','$urlRouterProvider',
function($stateProvider,$urlRouterProvider){
    $stateProvider.state('son',{
        url:'/son/:id',//路由传参
        resolve:{
            sonGet:['reqs','$stateParams','$q',function(reqs,$stateParams,$q){//$stateParams这个是路由传参的挂载点 里面有路由传参的值
                // return $stateParams
                var defer =$q.defer();
               reqs.getData('http://localhost:8087/sondata?id=1').then(function(res){//调用了这个服务  请求到了数据
                   defer.resolve(res)//成功resolve返回数据  失败是reject
                })
                return defer.promise;//返回promise 这个数据
            }]
        },
        controller:function($scope,sonGet){//在这引入resolve对象中的sonGet  请求回来的数据就是这个了
            console.log(sonGet.arr);
        $scope.sondata={
            resdata:sonGet,
            arr:sonGet.arr
        }
        },
        templateUrl:'../view/son.html'
    })
}])
