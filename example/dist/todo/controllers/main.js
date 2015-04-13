'use strict';

angular.module('todo').controller('main', function ($scope, api) {

    $scope.search = function (id) {
        api.find(id).then(function (data) {
            $scope.data = data;
        });
    };
});