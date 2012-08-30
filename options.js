
var load = chrome.extension.getBackgroundPage().load;
var save = chrome.extension.getBackgroundPage().save;



function getElem(id) {
	return document.getElementById(id);
}
function enableSaveButton() {
	var btn = getElem("save-options");
	console.log(btn);
	btn.removeAttribute("disabled");
}
function loadSavedSettings() {

	loadEnabledUrls();

}
function saveSettings() {
	saveEnabledUrls();

}
function loadEnabledUrls() {
	
	var urlList = getElem('url-list')
		, enabledUrls = load('enabledUrls')
		, key
		, str = "";

	for (key in enabledUrls) {
		if (enabledUrls.hasOwnProperty(key)) {
			str += key;
		}
	}
	urlList.innerHTML = str; 

}
function saveEnabledUrls() {
	var urlList = getElem('url-list')
		, urlArray = urlList.value.split(/\s+/);


	

	

	console.log(enabledUrls);
	localStorage.setItem("enabledUrls",JSON.stringify(enabledUrls));

}
function onDomContentLoaded(){

	loadSavedSettings();
	getElem('url-list').addEventListener("change", enableSaveButton,false); //HACK
	getElem('url-list').addEventListener("keyup", enableSaveButton ,false); //HACK

	getElem('save-options').addEventListener("click",saveSettings);

}

document.addEventListener("DOMContentLoaded",onDomContentLoaded);
