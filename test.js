var outbound = require("./outbound");

var ob = new outbound("myTestApiKey");

/*
The only things we want to test are to ensure we are forcing user IDs and event
as the proper types. User IDs must be string or number and events must be strings.

We don't need a success callback because the HTTP calls will always fail triggering
an error.
*/

console.log("Testing identify call.");
ob.identify([1,2]).error(
    function(err) {
        if (err.receivedCall) {
            console.log("[FAIL - identify] Should have recieved bad user ID error.");
        }
    }
);

console.log("Testing track call.");
ob.track([1,2], "1").error(
    function(err) {
        if (err.receivedCall) {
            console.log("[FAIL - track] Should have recieved bad user ID error.");
        }
    }
);

ob.track(1, 1).error(
    function(err) {
        if (err.receivedCall) {
            console.log("[FAIL - track] Should have recieved bad event error.");
        }
    }
);
