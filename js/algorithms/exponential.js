function exponentialSearch(arr, key, low, high) {
    if (low > high) return -1;
    if (arr[low].key === key) return low;
    let bound = 1, n = high - low + 1;
    while (bound < n && arr[low + bound].key <= key) bound *= 2;
    // binarySearch is imported globally via binary.js
    return binarySearch(arr, key, low + Math.floor(bound / 2), low + Math.min(bound, n - 1));
}

function interpExponentialSearch(arr, key) {
    let low = 0, high = arr.length - 1;
    if (low <= high && key >= arr[low].key && key <= arr[high].key) {
        if (arr[low].key === arr[high].key) return arr[low].key === key ? low : -1;
        let pos = low + Math.floor(((high - low) / (arr[high].key - arr[low].key)) * (key - arr[low].key));
        if (arr[pos].key === key) return pos;
        if (arr[pos].key < key) return exponentialSearch(arr, key, pos + 1, high);
        else return exponentialSearch(arr, key, low, pos - 1);
    }
    return -1;
}
