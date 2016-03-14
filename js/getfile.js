function getFile(file, callback){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200){
            callback(request.responseText);
        }
    };
    request.open("GET", file);
    request.send();
}