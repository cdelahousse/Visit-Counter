
$(document).ready(function () {
	'use strict';

	var globals = {};
	//Constants
	globals.fadeOutTime = 5*1000;
	globals.timeGap = 60*1000; 

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

	(function init() {

		chrome.storage.local.get(function (r) {
			var date = new Date(),
			c = {
				day : date.getDay(),
				month : date.getMonth(),
				year : date.getFullYear(),
				now: Date.now()
			};

		//console.log(r);
		//console.log(r.visits === undefined ); 
		//console.log(	r.date === undefined );
		//console.log(		c.day		!== parseInt(r.date.day,10));
		//console.log(		c.month	!== parseInt(r.date.month,10) );
		//console.log(		c.year		!== parseInt(r.date.year,10) );


			//Check if new day
			if (r.visits === undefined 
				|| r.date === undefined
				|| c.day		!== r.date.day
				|| c.month	!== r.date.month
				|| c.year		!== r.date.year ) {

				console.log("New day");

				//Restart for today
				r.visits = 0;

			//Ignore if we've recently visited the site
			} else if (c.now - r.date.now < globals.timeGap) {
				chrome.storage.local.set({
					"visits" : r.visits,
					"date" : c.date
				});
				return;
			} 

			var numVisits = r.visits;
			numVisits++;


			var div = buildUI(numVisits);

			//Delegate events
			$(div).on("click", "a", eventDelegation);


			document.body.appendChild(div);

			//$(div).ready(function() {
			//div.fadeIn("slow");
			//});

			var fadeTimeOut = setTimeout(function() {
				$(div).fadeOut("slow");
			}, globals.fadeOutTime );
			

			chrome.storage.local.set({
				"visits" : numVisits,
				"date" : c
			});

			function eventDelegation(e) {

				switch (e.target.id) {

					case 'clear':
						chrome.storage.local.clear();
						break;
					case 'exit':
						removeElem(div,fadeTimeOut);
						break;
					default:
						break;
				}
			}
		});
	}());

});


