//chrome.storage.local.clear();

$(document).ready(function () {

	chrome.storage.local.get(function (r) {
		var date = new Date(),
			c = {
				day : date.getDay(),
				month : date.getMonth(),
				year : date.getFullYear()
			};


		if (r.visits === undefined 
				|| r.date === undefined
				|| c.day		!== parseInt(r.date.day,10)
				|| c.month	!== parseInt(r.date.month,10)
				|| c.year		!== parseInt(r.date.year,10) ) {

			console.log("New day");

			//Restart for today
			r.visits = "0";
			r.date = {
				day : c.day,
				month :c.month,
				year : c.year
			};
		}

		var numVisits = parseInt(r.visits,10);
		numVisits++;

		var str = "Visit #" + numVisits;

		var div = document.createElement('div');

		div.innerHTML = str;
		div.style.position = "fixed";
		//div.style.height = "80px";
		//div.style.width = "175px";

		div.style.bottom = "5px";
		div.style.left= "5px";
		div.style.backgroundColor = "beige";
		div.style.border = "3px solid #967117";
		div.style.borderRadius = "4px";
		div.style.webkitBorderRadius= "4px";
		//div.style.textAlign="center";
		div.style.padding = "0.5em";
		div.style.fontSize="3em";
		div.style.lineHeight="1";

		//div.style.display= "none";


		document.body.appendChild(div);
		
		//$(div).ready(function() {
			//div.fadeIn("slow");
		//});
		
		setTimeout(function() {
			$(div).fadeOut("slow");
		}, 3000);

		chrome.storage.local.set({
			"visits" : numVisits.toString(),
			"date" : r.date
		});


	});

});


