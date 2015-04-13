import { $http } from 'angular';

export default {
    find(id = '') {
        return $http.get(`/api/${id}`)
    }
}