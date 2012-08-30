
$(document).ready(function () {
	'use strict';


	function buildUI(numVisits) {
		var frag = document.createDocumentFragment()
		,   div = document.createElement('div')
	  ,   span = document.createElement('span')
		,   str = "Visit #" + numVisits;



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

		if (timeOutId !== undefined) {
			clearTimeout(timeOutId);
		}
	}

	function init(response) {

		var settings = response.settings
			, numVisits = response.numVisits;
		console.log(numVisits);

			var div = buildUI(numVisits);

			//Delegate events
			$(div).on("click", "a", eventDelegation);


			document.body.appendChild(div);

			//$(div).ready(function() {
			//div.fadeIn("slow");
			//});

			var fadeTimeOut = setTimeout(function() {
				$(div).fadeOut("slow");
			}, settings.fadeOutTime );
			

			function eventDelegation(e) {

				switch (e.target.id) {

					case 'clear':
						chrome.storage.local.clear();
						break;
					case 'exit':
						removeElem(div,settings.fadeTimeOut);
						break;
					default:
						break;
				}
			}
	}


	(function() {
		var sndMsg = chrome.extension.sendMessage;
		//Run if enabled
		sndMsg({msg : "isEnabled"},function (response) {
			console.log(response ,"Enabled!");
			if (response) {
				sndMsg({msg : "updateEnabledUrlState"}, init);
			}
			else { return; }
		});
	}());

});
