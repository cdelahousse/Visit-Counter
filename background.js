
var globals = {};

////Globals
//var settings;
//var enabledUrls;

//Get from localStorage
//Has side effects
function load(key) {
	globals[key] = JSON.parse(localStorage.getItem(key));
}

//Save to local storage
//Has side effects
function save(key,obj) {
	console.log('Saving to localStorage and globals["' + key + '"]');
	localStorage.setItem(key,JSON.stringify(obj));
	globals[key] = obj;
}

function CurrentDate(d) {
	var date = d || new Date();
	return {
			day : date.getDate()
		, month : date.getMonth()
		,	year : date.getFullYear()
		,	now: Date.now()
	};
}

//localStorage.clear(); //XXX
if (localStorage.length > 0) {
	console.log("Loading from localStorage");
	
	load("settings");
	load("enabledUrls");

} else {

	console.log("Setting to defaults");
	var defaultSettings = {
		fadeOutTime :	 5 * 1000 ,
		timeGap :			 60*1000
	};

	var defaultEnabledUrls = {
		"http*://*.facebook.com/*" : {
			numVisits : 0,
			dateVisited : new CurrentDate()
		}
	};

	save("settings",defaultSettings);
	save("enabledUrls",defaultEnabledUrls);
}


function isUrlEnabled(url) {
	return getEnabledUrlKey(url) !== null;
}
function getEnabledUrl(key) {
	return globals.enabledUrls[key];
}



//Convert URL to EnabledUrl key
//See's if url (typically from current page) matches set of enabledUrls
//Returns null if no match
function getEnabledUrlKey(url) {

	var key;

	for (key in globals.enabledUrls) {
		if (globals.enabledUrls.hasOwnProperty(key)) {
			//So that dots are literal dots
			var regexstr = key.replace(/\./g, "\\\.");
			//So that users can use * instead of .*
			regexstr = "^" +regexstr.replace(/\*/g, ".*") + "$";
			var regexp = new RegExp(regexstr);

			console.log(regexstr);
			console.log(regexstr,url.match(regexp));

			if (url.match(regexp)) {
				return key;
			}
		}
	}

	return null;
}


function incrementCounter(url) {
	var key = getEnabledUrlKey(url)
		, data = getEnabledUrl(key);

	data.numVisits++;

}


//Persist state
function saveState() {
	localStorage.setItem("enabledUrls",JSON.stringify(globals.enabledUrls));
	localStorage.setItem("settings",JSON.stringify(globals.settings));
}

function updateEnabledUrlState(key) {
	var currentEnabledUrl = getEnabledUrl(key);

	var c = new CurrentDate() ;

	//Check if new day
	if (	// currentEnabledUrl.numVisits === undefined 
			//|| currentEnabledUrl.dateVisited === undefined
			 c.day		!== currentEnabledUrl.dateVisited.day
			|| c.month	!== currentEnabledUrl.dateVisited.month
			|| c.year		!== currentEnabledUrl.dateVisited.year) {

		console.log("New day: resetting...");

		//Restart for today
		currentEnabledUrl.numVisits = 1;


	//Same date
	//Increment if we haven't recently visited the site
	} else if (c.now - currentEnabledUrl.dateVisited.now >= globals.settings.timeGap) {
		currentEnabledUrl.numVisits++;
		console.log("Incrementing numVisits: ", currentEnabledUrl.numVisits);
	} 

	currentEnabledUrl.dateVisited = c;

	saveState();

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

				case "updateEnabledUrlState" :
					var key = getEnabledUrlKey(url);
					updateEnabledUrlState(key);
					sendResponse( {
							"settings" : globals.settings,
							"numVisits" : getEnabledUrl(key).numVisits
					});
					break;

				case "getData" : 
					break; 

				case "getSettings":
					sendResponse(globals.settings);
					break;

				case "clear":
					break;
				
				default:
					sendResponse(null);
			}
			
});

