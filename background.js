
var globals = {};

//Get from localStorage
//Has side effects
function load(key) {

	console.log('Loading ' + key + ' to globals["' + key + '"]');
	globals[key] = JSON.parse(localStorage.getItem(key));
}

//Save to local storage
//Has side effects
function save(key,obj) {
	console.log('Saving to localStorage and globals["' + key + '"]');
	localStorage.setItem(key,JSON.stringify(obj));
	globals[key] = obj;
}
//Persist state
function saveAllState() {
	var key;
	for (key in globals) {
		if (globals.hasOwnProperty(key)) {
			save(key,globals[key]);
		}
	}
}

//Load all state 
function loadAllState() {
	var key;
	for (key in localStorage) {
		if (localStorage.hasOwnProperty(key)) {
			load(key);
		}
	}
}

//Custom Date object contructor
function DateObj(d) {
	var date = d || new Date();
	return {
			day : date.getDate()
		, month : date.getMonth()
		,	year : date.getFullYear()
		,	now: Date.now()
	};
}

//EnabledUrlObj constructor
//@params:
//	string key;
//	bool useCurrentDate : use this current date or not
function EnabledUrlObj (key,useCurrentDate) {

	//If false, use earliest date possible
	var d = useCurrentDate ? undefined : new Date(0);
	return {
		numVisits : 0,
		dateVisited : new DateObj(d)
	};
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

function updateEnabledUrlState(key) {
	var currentEnabledUrl = getEnabledUrl(key);

	var c = new DateObj() ;

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

	saveAllState();

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



//Run program

if (localStorage.length > 0) {
	console.log("Loading from localStorage");
	
	loadAllState();

} else {

	console.log("Setting to defaults");
	var defaultSettings = {
		fadeOutTime :	 5 * 1000 ,
		timeGap :			 60*1000
	};

	var defaultEnabledUrls = {
			"http*://*.facebook.com/*" : new EnabledUrlObj("http*://*.facebook.com/*",false)
		, "http*://*.google.*" : new EnabledUrlObj("http*://*.google.*",false)
	};

	save ("settings", defaultSettings);
	save ("enabledUrls", defaultEnabledUrls);
}
