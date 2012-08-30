function getElem(id) {
	return document.getElementById(id);
}
function enableSaveButton() {
	var btn = getElem("save-options");
	console.log(btn);
	btn.removeAttribute("disabled");
}
function loadSavedSettings() {

	var urlList = getElem('url-list')
		, enabledUrls = JSON.parse(localStorage.getItem("enabledUrls"));

	console.log(enabledUrls);
	urlList.innerHTML = enabledUrls.join("\n");

}
function saveSettings() {
	var urlList = getElem('url-list')
		, enabledUrls = urlList.value.split(/\s+/);
	
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
