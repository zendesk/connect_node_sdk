# Outbound Javascript Library
Outbound sends automated email, SMS, phone calls and push notifications based on the actions users take or do not take in your app. The Outbound API has two components:

Identify each of your users and their attributes using an identify API call.
Track the actions that each user takes in your app using a track API call.
Because every message is associated with a user (identify call) and a specific trigger action that a user took or should take (track call), Outbound is able to keep track of how each message affects user actions in your app. These calls also allow you to target campaigns and customize each message based on user data.

Example: When a user in San Francisco(user attribute) does signup(event) but does not upload a picture(event) within 2 weeks, send them an email about how they'll benefit from uploading a picture.

The Outbound Javascript library is designed to work in both browsers and within a node.js app.

## Browser
### Installation

    bower install outbound

### Usage

    <script src="outbound.js"></script>
    <script>
        var ob = new outbound("YOUR API KEY");

        // Identify a user
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

        // Track an event
        eventProperties = {
            eventAttr1: "Something"
        }
        ob.track(userId, eventName, eventProperties).then(
            successCallback,
            errorCallback
        )
    </script>

## Node.js
### Installation

    npm install outbound

### Usage

    var outbound = require("outbound");
    var ob = new outbound("YOUR API KEY");

    // Identify a user
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

    // Track an event
    eventProperties = {
        eventAttr1: "Something"
    }
    ob.track(userId, eventName, eventProperties).then(
        successCallback,
        errorCallback
    )

    // Register a device token
    // Change name to "registerGcmToken" to register GCM token
    ob.registerApnsToken(userId, token).then(
        successCallback,
        errorCallback
    )

    // Disable a device token
    // Change name to "disableGcmToken" to disable GCM token
    ob.disableApnsToken(userId, token).then(
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

### Device Tokens
- If you send a device token through an `identify` call, that is equivalent to sending a `register` call. Regardless of the state of that token it will become active again and we will attempt to send notifications to it. It is recommended that if you use the `register` and `disable` calls that you DO NOT send any tokens in `identify` calls. This way you can more easily control the state of your tokens.

### Callbacks
- Error callback takes a single parameter which will be an error object containing 2 properties: `receivedCall` and `message`. `receivedCall` is a `boolean` indicating whether or not Outbound received the API call or if the request failed prior. `message` will be a string describe what exactly went wrong.
- Success callback takes no parameters.

### Asynchronous Calls
Promises are used to make asynchronous calls. We've implemented D.js by [maiko](http://malko.github.io/D.js/). Both the `identify` and `track` function calls return promises. You can use `.then(successCallback, errorCallback)` to handle errors and/or success states. See the "Promises Methods" in the [D.js documentation](http://malko.github.io/D.js/) for other options that are supported as well.
