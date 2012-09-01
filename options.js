
var load = chrome.extension.getBackgroundPage().load;
var save = chrome.extension.getBackgroundPage().save;
var CurrentDate = chrome.extension.getBackgroundPage().CurrentDate;



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
		, enabledUrls = load('enabledUrls')
		, key
		, a = [];


	for (key in enabledUrls) {
		if (enabledUrls.hasOwnProperty(key)) {
			a.push(key);
		}
	}
	urlList.value = a.join('\n'); 

}
function saveEnabledUrls() {
	var urlList = getElem('url-list')
		, urlStrings = urlList.value.trim().split(/\s+/)
		, enabledUrls = load('enabledUrls')
		, newEnabledUrls = {};

	console.log(urlStrings);

	//Copy everything over to new object and ignore the rest
	urlStrings.forEach(function(str) {

		if (enabledUrls[str]) {
			newEnabledUrls[str] = enabledUrls[str];
		}
		else {
			var curDate = new CurrentDate();
			newEnabledUrls[str] = {
				numVisits : 0,
				dateVisited : new CurrentDate()
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
