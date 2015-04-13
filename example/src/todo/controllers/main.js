import { $scope, api } from 'angular';

$scope.search = function(id) {
    api.find(id)
        .then((data) => {
            $scope.data = data;
        })
};