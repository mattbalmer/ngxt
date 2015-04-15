'use strict';

angular.module('todo').directive('directive', function () {
    return {
        restrict: 'E',
        replace: true,
        controller: 'todo-list',
        templateUrl: 'template.html'
    };
});