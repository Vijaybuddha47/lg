function get_ip_address()
{
	// Subscription
	var subscriptionHandle;
	  
	subscriptionHandle = webOS.service.request("luna://com.palm.connectionmanager", {
		method: "getStatus",
		parameters: { "subscribe": true },
		onSuccess: function (inResponse) {
			if (typeof(inResponse.subscribed) != 'undefined') {
				if (!inResponse.subscribed) {
					console.log("Failed to subscribe network state");
					return;
				}
			}
			console.log("Result: ", inResponse);
			$.each(inResponse, function(i, item) {
				if (inResponse[i].state === "connected") {
					IP_ADDRESS = inResponse[i].ipAddress;
					console.log("Ip address", IP_ADDRESS);
					
				}
			});
			
			// To-Do something
		},
		onFailure: function (inError) {
			console.log("Failed to get network state");
			console.log("[" + inError.errorCode + "]: " + inError.errorText);
			// To-Do something
			return;
		}
	});
}