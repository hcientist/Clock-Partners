$(document).ready(function(){
	$("#hide-hero").click(function(){
		$("#hero").hide();
	});
	$("#make-roster").click(function(){
		console.log(makeRoster());
	});
	$("#roster").click(function(){
		$("#roster").val("");
		$("#roster").unbind("click");
	})
});

function pairUp (clock, names, i, j) {
	console.log("pairUp i: " + i + ", j: " +j);
	clock[names[i]].push(names[j]);
	clock[names[j]].push(names[i]);
	console.log(names[i] + " : " + names[j]);
}

function pairAll (partners, names, topLine, bottomLine) {
	for (var i = 0; i < topLine.length; i++) {
		pairUp(partners, names, topLine[i], bottomLine[i]);
	}
}

function makeRoster() {
	var names = $("#roster").val().split("\n");

	var clock_partners = {};
	for (var nameIndex=0; nameIndex < names.length; nameIndex++) {
		clock_partners[names[nameIndex]] = [];
	}

	var max = 12;
	if (names.length < max) {
		max = names.length-1;
	}

	// following thanks to @nathanhammond's hugcircle experience
	var topLine = [];
	var bottomLine = [];
	for (var i = 0; i < names.length/2; i++) {
		topLine.push(i);
		bottomLine.push(names.length-1-i);
	}

	recursiveHugCircle(clock_partners, names, topLine, bottomLine, max);

	return clock_partners;
}

function recursiveHugCircle (partners, names, topLine, bottomLine, n) {
	pairAll(partners, names, topLine, bottomLine);
	n--;

	if (n > 0) {

		//transition1
		var bottomLine1 = bottomLine.slice(0);
		bottomLine1.push(bottomLine1.shift());
		pairAll(partners, names, topLine, bottomLine1);
		n--;

		if (n > 0) {
			//transition2
			topLine.unshift(bottomLine.shift());
			bottomLine.push(topLine.pop());
			recursiveHugCircle(partners, names, topLine, bottomLine, n);
		}
	}
}

