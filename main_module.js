var app = angular.module('myMod', ['ngRoute', 'ngSanitize', 'ngAnimate'])
    .controller('MainController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {

        $scope.activeTab = '';

        // Watch for changes in the route
        $scope.$on('$routeChangeSuccess', function () {

            const currentPath = $location.path();
            if (currentPath.startsWith('/admin')) {
                $scope.bgClass = 'bg-view-black';
            } else if (currentPath === '/home' || currentPath === '/info') {
                $scope.bgClass = 'bg-view-pink';
            } else {
                $scope.bgClass = 'bg-default';
            }

            $scope.activeTab = $location.path();

        });

        $scope.copyToClipboard = function (textToCopy) {
            // Copy text to the clipboard
            navigator.clipboard.writeText(textToCopy).then(function () {
                alert("Text copied to clipboard!");
            }).catch(function (error) {
                console.error("Could not copy text: ", error);
                alert("Failed to copy text.");
            });
        };

        
        $scope.isActive = function (tab) {
            return $scope.activeTab === tab;
        }

        $scope.goToPage = function (path) {
            $location.path(path);
        };

        $scope.cart = [];
        $scope.wishlist = [];
        $scope.showSuccessAlert = false;
        $scope.showWarningAlert = false;
        $scope.alertMessage = "";

        $scope.addToCart = function(item){

            const exists = $scope.cart.some(cart => cart.id === item.id);
            if (!exists) {
                $scope.cart.push(item);
                $scope.alertMessage = item.name + " has been added to the cart!";
                $scope.showWarningAlert = false;
                $scope.showSuccessAlert = true;

                // Automatically hide the alert after 3 seconds
                $timeout(function () {
                    $scope.showSuccessAlert = false;
                }, 3000);
            } else {

                $scope.alertMessage = item.name + " already in cart!";
                $scope.showSuccessAlert = false;
                $scope.showWarningAlert = true;

                // Automatically hide the alert after 3 seconds
                $timeout(function () {
                    $scope.showWarningAlert = false;
                }, 3000);
            }

        };


        $scope.addToWishlist = function(item){

            const exists = $scope.wishlist.some(wishlist => wishlist.id === item.id);
            if (!exists) {
                $scope.wishlist.push(item);
                $scope.alertMessage = item.name + " has been added to the wishlist!";
                $scope.showWarningAlert = false;
                $scope.showSuccessAlert = true;
                // Automatically hide the alert after 3 seconds
                $timeout(function () {
                    $scope.showSuccessAlert = false;
                }, 3000);
            } else {

                $scope.alertMessage = item.name + " already in wishlist!";
                $scope.showSuccessAlert = false;
                $scope.showWarningAlert = true;

                // Automatically hide the alert after 3 seconds
                $timeout(function () {
                    $scope.showWarningAlert = false;
                }, 3000);
            }
            
        };

        $scope.getTotalPrice = function () {
            return $scope.cart.reduce(function (total, item) {
                return total + item.price;
            }, 0).toFixed(2);
        };

    }]);


app.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/homepage.html',
        })
        .when('/menu', {
            templateUrl: 'views/menu.html',
            controller: 'MenuCtrl'
        })
        .when('/wishlist', {
            templateUrl: 'views/wishlist.html'
        })
        .when('/about-us', {
            templateUrl: 'views/aboutus.html'
        })
        .otherwise({
            redirectTo: '/home'
        });
});

app.controller('MenuCtrl', function($scope, $http){
    $scope.items = [];
    $http({
        method: 'GET',
        url: 'http://localhost:8080/menu',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
            if (response.status == 200){
                $scope.items = response.data.data; 
            }
            else {
                console.error("Oops!!! There server is down. Checkback in a while!",response.status);
            }
        })
        .catch(function(error) {
            console.error('Error fetching JSON file:', error);
        });
})
