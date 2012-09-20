$(document).ready(function() {
  var helpText = true;
	$("#hide-hero").click(function() {
		$("#hero").hide();
	});
	$("#make-roster").click(function() {
    $("#roster").popover('hide');
		if (makeRoster()) {
      $("#clear-roster").removeClass("hidden");  
    }
	});
	$("#clear-roster").click(function() {
		$("#clear-roster").addClass("hidden");
    $("#partner-list").children().remove();		
	});
	$("#roster").click(function() {
    if (helpText) {
  		$("#roster").val("");
      helpText = false;
    }
    $("#roster").popover('hide');
	})
  $("#clockTemplate").hide();
  
  // $("#roster").popover({
  //   "title": "Too few students",
  //   "content": "Making pairs with only 3 or fewer students doesn't work so well, because it would require the third person to be left out, or else for all threee to always work together.",
  //   "trigger": "manual"
  // });
});

function pairUp (clock, names, i, j) {
	// console.log("pairUp i: " + i + ", j: " +j);
	clock[names[i]].push(names[j]);
	clock[names[j]].push(names[i]);
	// console.log(names[i] + " : " + names[j]);
}

function makeRoster() {
	var names = $.trim($("#roster").val()).split("\n");
  for (var i = 1; i < names.length; i++) {
    if (names.slice(0,i).indexOf(names[i]) > -1) {
      //we have a duplicate name at i
      names[i] += " " + i;
    }
  }

  // if(names.length < 4) {
  //   $("#roster").popover('show');
  //   return false;
  // }

  var numStudentsWithoutOddPlaceholder = names.length;

	var oddStudent = false;
  var oddStudentPlaceHolderName = "THIRD";

	var maxRounds = 12;
	if (names.length <= maxRounds) {
    oddStudent = names.length%2 == 1;
		if (oddStudent) {
			names.push(oddStudentPlaceHolderName);
		}
    maxRounds = names.length-1;
	}

  var numStudents = names.length;

	var clock_partners = {};
	for (var nameIndex=0; nameIndex < names.length; nameIndex++) {
		clock_partners[names[nameIndex]] = [];
	}

	//this algorithm is thanks to Jim!
	for (var r = 0; r < maxRounds; r++) {
		pairUp(clock_partners, names, r, numStudents-1);

		for (var i = 1; i < numStudents/2; i++) {
			pairUp(clock_partners, names, mod((r+i),(numStudents-1)), mod((r-i),(numStudents-1)));
		}
	}

	//yay Jim! look how easy that was!

  //now to deal with the odd student (who will be a third in a pair for that round)
	if (oddStudent) {
	    var theOddStudents = clock_partners[oddStudentPlaceHolderName];
	    for (var i = 0; i < theOddStudents.length; i++) {
	      var oddStudentName = theOddStudents[i];
	      var adjStudentName = names[mod(names.indexOf(oddStudentName) + 1, names.length-1)];
	      var adjStudentPartnerName = clock_partners[adjStudentName][i];
	      clock_partners[oddStudentName][i] = [adjStudentName, adjStudentPartnerName];
	      clock_partners[adjStudentName][i] = [clock_partners[adjStudentName][i], oddStudentName];
	      clock_partners[adjStudentPartnerName][i] = [clock_partners[adjStudentPartnerName][i], oddStudentName];      
	    }
	    delete clock_partners[oddStudentPlaceHolderName];
	}

  console.log(clock_partners);
  for (var i = 0; i < numStudentsWithoutOddPlaceholder; i++) {
    $("#partner-list").append(makeClock(clock_partners, names, i, maxRounds));
  }
	// return clock_partners;
  return true;
}

//ridiculous negative mods in js
function mod(dividend, divisor) {
	return ((dividend % divisor) + divisor) % divisor;
}

function makeClock(clock_partners, names, i, maxRounds) {
  console.log(maxRounds);
  var clock_i = $("#clockTemplate").clone();
  // debugger;
  clock_i.find("#my-name tspan").text(names[i]);
  for (var hour = 0; hour < maxRounds; hour++) {
    console.log("#name" + (hour+1) + " tspan");
    var name_slot = clock_i.find("#name" + (hour + 1) + " tspan");
    // console.log("typeof");
    // console.log(typeof clock_partners[names[i]][hour]);
    if (typeof clock_partners[names[i]][hour] && typeof clock_partners[names[i]][hour] === 'string') {
      name_slot.text(clock_partners[names[i]][hour]);
    }
    else { //we have 2 partners this hour
      name_slot.text(clock_partners[names[i]][hour][0] + " & " + clock_partners[names[i]][hour][1]);
    }
  }
  clock_i.show();
  return clock_i;
}