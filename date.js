exports.getDate = function(){
var today = new Date();
    var options = {
        weekday:"long",
        month:"numeric",
        day:"numeric"
    }
    return today.toLocaleString("en-US",options);

}
exports.getDay = function(){
var today = new Date();
    var options = {
        weekday:"long"
    }
    return today.toLocaleString("en-US",options);
}