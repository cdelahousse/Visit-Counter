

var settings;
var enabledUrls;

//Get from localStorage
function load(key) {
	return JSON.parse(localStorage.getItem(key));
}

//Save to local storage
function save(key,obj) {
	localStorage.setItem(key,JSON.stringify(obj));
}

function CurrentDate() {
	var date = new Date();
	return {
		day : date.getDate(),
			month : date.getMonth(),
			year : date.getFullYear(),
			now: Date.now()
	};
}

//localStorage.clear(); //XXX
if (localStorage.length > 0) {
	console.log("Loading from localStorage");
	
	settings = load("settings");
	enabledUrls = load("enabledUrls");
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

	settings = defaultSettings; 
	enabledUrls = defaultEnabledUrls;
	save("settings",settings);
	save("enabledUrls",enabledUrls);
}


function isUrlEnabled(url) {
	return getEnabledUrlKey(url) !== null;
}
function getEnabledUrl(key) {
	return enabledUrls[key];
}



//Convert URL to EnabledUrl key
//See's if url (typically from current page) matches set of enabledUrls
//Returns null if no match
function getEnabledUrlKey(url) {

	var key;

	for (key in enabledUrls) {
		if (enabledUrls.hasOwnProperty(key)) {
			//So that users can use * instead of .*
			var regexstr = "^" + key.replace(/\*/g, ".*") + "$";
			var regexp = new RegExp(regexstr);

			//console.log(url.match(regexp));

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
	localStorage.setItem("enabledUrls",JSON.stringify(enabledUrls));
	localStorage.setItem("settings",JSON.stringify(settings));
}

function updateEnabledUrlState(key) {
	var enabledUrlObj = getEnabledUrl(key);

	var c = new CurrentDate() ;

	console.log(c, enabledUrlObj.dateVisited.day);
	//Check if new day
	if (	// enabledUrlObj.numVisits === undefined 
			//|| enabledUrlObj.dateVisited === undefined
			 c.day		!== enabledUrlObj.dateVisited.day
			|| c.month	!== enabledUrlObj.dateVisited.month
			|| c.year		!== enabledUrlObj.dateVisited.year) {

		console.log("New day");

		//Restart for today
		enabledUrlObj.numVisits = 1;


	//Same date
	//Increment if we haven't recently visited the site
	} else if (c.now - enabledUrlObj.dateVisited.now >= settings.timeGap) {
		enabledUrlObj.numVisits++;
	} 

	enabledUrlObj.dateVisited = c;

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
							"settings" : settings,
							"numVisits" : getEnabledUrl(key).numVisits
					});
					break;

				case "getData" : 
					break; 

				case "getSettings":
					sendResponse(settings);
					break;
				
				default:
					sendResponse(null);
			}
			
	});




//chrome.storage.local.get(function (r) {
	//var c = new CurrentDate() ;

////console.log(r);
////console.log(r.visits === undefined ); 
////console.log(	r.date === undefined );
////console.log(		c.day		!== parseInt(r.date.day,10));
////console.log(		c.month	!== parseInt(r.date.month,10) );
////console.log(		c.year		!== parseInt(r.date.year,10) );


////Check if new day
//if (r.visits === undefined 
	//|| r.date === undefined
	//|| c.day		!== r.date.day
	//|| c.month	!== r.date.month
	//|| c.year		!== r.date.year ) {

	//console.log("New day");

	////Restart for today
	//r.numVisits = 0;

	////Ignore if we've recently visited the site
//} else if (c.now - r.date.now < settings.timeGap) {
	//chrome.storage.local.set({
		//"numVisits" : r.numVisits,
		//"date" : c.date
	//});
	//return;
//} 

//var numVisits = r.visits;
//numVisits++;


//chrome.storage.local.set({
	//"visits" : numVisits,
	//"date" : c
//});

//});
