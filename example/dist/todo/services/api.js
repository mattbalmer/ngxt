'use strict';

angular.module('todo').service('api', function ($http) {

    return {
        find: function find() {
            var id = arguments[0] === undefined ? '' : arguments[0];

            return $http.get('/api/' + id);
        }
    };
});