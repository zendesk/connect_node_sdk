# Outbound Javascript Library
The Outbound javascript is designed to work in both browsers and within a node.js app.

Promises are used to make asynchronous calls. We've implemented D.js by [maiko](http://malko.github.io/D.js/). See its documentation for complete usage.

## Browser

    <script src="outbound.js"></script>
    <script>
        var ob = new outbound("YOUR API KEY");
        var userAttributes = {
            first_name: "First",
            last_name: "Last",
            email: "username@domain.com",
            phoneNumber: "5551234567",
            apnsTokens: ["ios device token"],
            gcmTokens: ["android device token"]
        };
        ob.identify(userId, userAttributes).then(
            successCallback,
            errorCallback
        )

        eventPayload = {
            eventAttr1: "Something"
        }
        ob.track(userId, eventName, eventPayload).then(
            successCallback,
            errorCallback
        )
    </script>

## Node.js

    var outbound = require("outbound");
    var ob = new outbound("YOUR API KEY");

    var userAttributes = {
        first_name: "First",
        last_name: "Last",
        email: "username@domain.com",
        phoneNumber: "5551234567",
        apnsTokens: ["ios device token"],
        gcmTokens: ["android device token"]
    };
    ob.identify(userId, userAttributes).then(
        successCallback,
        errorCallback
    )

    eventPayload = {
        eventAttr1: "Something"
    }
    ob.track(userId, eventName, eventPayload).then(
        successCallback,
        errorCallback
    )
