

var settings;
var enabledUrls;


//localStorage.clear(); //XXX
if (localStorage.length > 0) {
	
	settings = JSON.parse(localStorage.getItem("settings"));
	enabledUrls = JSON.parse(localStorage.getItem("enabledUrls"));
} else {

	var defaultSettings = {
		fadeOutTime :	 5 * 1000 ,
		timeGap :			 60*1000
	};

	settings = defaultSettings; 
	enabledUrls = ["http*://*.facebook.com/*"];
	localStorage.setItem("settings",JSON.stringify(settings));
	localStorage.setItem("enabledUrls",JSON.stringify( enabledUrls));
}

function isUrlEnabled(url) {
	var i
		, isEnabled = false;
	for (i = 0; i < enabledUrls.length; i++) {
		//Convert * to .* --> user doesn't need to know about regexes
		var regexstr = "^" + enabledUrls[i].replace(/\*/g, ".*") + "$";
		var regexp = new RegExp(regexstr);

		if (url.match(regexp)) {
			isEnabled = true;
			break;
		}
	}
	return isEnabled;
}



//Message passing
chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			var url = sender.tab.url;

			switch (request.msg) {
				case "isEnabled" :
					var isEnabled = isUrlEnabled(url);
					sendResponse(isEnabled);
					break;

				case "getSettings":
					sendResponse(settings);
					break;
				default:
					sendResponse(null);
			}
			
	});

