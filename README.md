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
            gcmTokens: ["android device token"],
            attributes: {
                someCustomAttribute: "lorem ipsum"
            }
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
        attributes: {
            someCustomAttribute: "lorem ipsum"
        }
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

## Specifics
### User ID
- A user ID must ALWAYS be a string or a number. Anything else will trigger an error and the call will not be sent to Outbound. User IDs are always stored as strings. Keep this in mind if you have different types. A user with ID of 1 (the number) will be considered the same as user with ID of "1" (the string).
- A user ID should be static. It should be the same value you use to identify the user in your own system.

### Event Name
- An event name in a track can only be a string. Any other type of value will trigger an error and the call will not be sent to Outbound.
- Event names can be anything you want them to be (as long as they are strings) and contain any character you want.

### Callbacks
- Error callback takes a single parameter which will be an error object containing 2 properties: `receivedCall` and `message`. `receivedCall` is a `boolean` indicating whether or not Outbound received the API call or if the request failed prior. `message` will be a string describe what exactly went wrong.
- Success callback takes no parameters.
