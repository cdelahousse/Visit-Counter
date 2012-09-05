'use strict';

var sndMsg = chrome.extension.sendMessage;

function buildUI(numVisits) {
	var div = document.createElement('div')
	,   span = document.createElement('span')
	,   str = "Visit #" + numVisits;


	div.id = "visit-counter";
	div.style.position = "fixed";
	div.style.bottom = "5px";
	div.style.left= "5px";
	div.style.backgroundColor = "beige";
	div.style.border = "3px solid #967117";
	div.style.borderRadius = "4px";
	div.style.webkitBorderRadius= "4px";
	div.style.padding = "1em";

	span.innerHTML = str;
	span.style.fontSize="3em";
	span.style.lineHeight="1";
	div.appendChild(span);


	var nav = document.createElement('div');
	nav.style.fontSize = "0.2em";
	nav.style.position= "absolute";
	nav.style.top= "2px";
	nav.style.right= "2px";

	var clearButton = document.createElement('a');
	clearButton.href = "#";
	clearButton.innerHTML = "Clear ";
	clearButton.id = "clear";
	nav.appendChild(clearButton);


	var exitButton = document.createElement('a');
	exitButton.href = '#';
	exitButton.innerHTML = "[X]";
	exitButton.id = "exit";
	nav.appendChild(exitButton);

	div.appendChild(nav);
	
	return div;

}

function removeElem(elem,timeOutId) {
	elem.parentNode.removeChild(elem);
}

function init(response) {

	var settings = response.settings
		, numVisits = response.numVisits;

		var div = buildUI(numVisits);


		var fadeTimeOutId;
		$(document).ready(function () {
		//document.addEventListener("DOMContentLoaded",function() {
		//Figure out why addEventListener("domasdfasdf") doesn't work on google
			document.body.appendChild(div);

			//Delegate events
			$(div).on("click", "a", eventDelegation);

			fadeTimeOutId = setTimeout(function() {
				$(div).fadeOut("slow");
			}, settings.fadeOutTime );

		});

		function exit() {
			removeElem(div);
			clearTimeout(fadeTimeOutId);
		}
		function eventDelegation(e) {

			switch (e.target.id) {

				case 'clear':
					console.log("Clearing");
					sndMsg({msg : "clear"},exit );
					break;
				case 'exit':
					exit();
					break;
				default:
					break;
			}
		}
}


(function() {
	//Check if this script is enabled for this site
	sndMsg({msg : "isEnabled"},function (response) {
		if (response) {
			console.log("Visit Counter is enabled on this site");
			sndMsg({msg : "updateEnabledUrlState"}, init);
		}
		else { return; }
	});
}());

