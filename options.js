
var bg = chrome.extension.getBackgroundPage()
	, globals = bg.globals
	, load = bg.load
	, save = bg.save
	, CurrentDate = bg.CurrentDate;




function getElem(id) {
	return document.getElementById(id);
}
function enableSaveButton(bool) {
	var btn = getElem("save-options");

	if (bool === undefined) {
		bool = false;
	}
	else {
		bool = !bool;
	}
	btn.disabled = bool;
}
function loadSavedSettings() {

	loadEnabledUrls();

}
function saveSettings() {
	saveEnabledUrls();

	enableSaveButton(false);
	loadSavedSettings();

}
function loadEnabledUrls() {
	
	var urlList = getElem('url-list')
		, key
		, a = [];


	for (key in globals.enabledUrls) {
		if (globals.enabledUrls.hasOwnProperty(key)) {
			a.push(key);
		}
	}
	urlList.value = a.join('\n'); 

}
function saveEnabledUrls() {
	var urlList = getElem('url-list')
		, urlStrings = urlList.value.trim().split(/\s+/)
		, newEnabledUrls = {};


	//Copy everything over to new object and ignore the rest
	urlStrings.forEach(function(str) {

		if (globals.enabledUrls[str]) {
			newEnabledUrls[str] = globals.enabledUrls[str];
		}
		else {
			var curDate = new CurrentDate();
			newEnabledUrls[str] = {
				numVisits : 0,
				//Set earliest date possible
				dateVisited : new CurrentDate(new Date(0))
			};
		}
	});

	save('enabledUrls', newEnabledUrls);

}
function onDomContentLoaded(){

	loadSavedSettings();
	getElem('url-list').addEventListener("change", enableSaveButton,false); //HACK
	getElem('url-list').addEventListener("keyup", enableSaveButton ,false); //HACK
	getElem('save-options').addEventListener("click",saveSettings);

	enableSaveButton(false);

}

document.addEventListener("DOMContentLoaded",onDomContentLoaded);
