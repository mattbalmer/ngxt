export function firstIndex(array, fn) {
    let index = -1;
    for(let i in array) {
        let result = fn(array[i], i);
        if(result) {
            index = i;
            break;
        }
    }
    return index;
}

export function lastIndex(array, fn) {
    let index = -1;
    for(let i in array) {
        let result = fn(array[i], i);
        if(result) {
            index = i;
        }
    }
    return index;
}