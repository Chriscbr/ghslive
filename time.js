// This is the list of holidays, during which the day schedule does not change.
var specialDates = [];
specialDates.push([9, 2, 2013, "GHSLive will open on Wednesday"]);
specialDates.push([9, 3, 2013, "GHSLive will open on Wednesday"]);
specialDates.push([10, 14, 2013, "Columbus Day"]);
specialDates.push([11, 8, 2013, "Parent Teacher Conferences"]);
specialDates.push([11, 11, 2013, "Veteran's Day"]);
specialDates.push([11, 27, 2013, "Thanksgiving Break"]);
specialDates.push([11, 28, 2013, "Thanksgiving Break"]);
specialDates.push([11, 29, 2013, "Thanksgiving Break"]);
specialDates.push([12, 21, 2013, "Winter Break"]);
specialDates.push([12, 22, 2013, "Winter Break"]);
specialDates.push([12, 23, 2013, "Winter Break"]);
specialDates.push([12, 24, 2013, "Winter Break"]);
specialDates.push([12, 25, 2013, "Winter Break"]);
specialDates.push([12, 26, 2013, "Winter Break"]);
specialDates.push([12, 27, 2013, "Winter Break"]);
specialDates.push([12, 28, 2013, "Winter Break"]);
specialDates.push([12, 29, 2013, "Winter Break"]);
specialDates.push([12, 30, 2013, "Winter Break"]);
specialDates.push([12, 31, 2013, "Winter Break"]);
specialDates.push([1, 1, 2014, "New Years Day"]);
specialDates.push([1, 20, 2014, "Martin Luther King Day"]);
specialDates.push([1, 22, 2014, "Midterms"]);
specialDates.push([1, 23, 2014, "Midterms"]);
specialDates.push([1, 24, 2014, "Midterms"]);
specialDates.push([2, 17, 2014, "February Break"]);
specialDates.push([2, 18, 2014, "February Break"]);
specialDates.push([2, 19, 2014, "February Break"]);
specialDates.push([2, 20, 2014, "February Break"]);
specialDates.push([2, 21, 2014, "February Break"]);

// This is a list of the months of the year
var months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

// This is a list of the days of the week
var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/*
blockTimes stores the data for the block times. For each unit of time, there is a
given displayText, start time, and end time.

displayText: the text that should appear for that block, including a space for
showing the time left
- values as a string, with %t representing the number of minutes left until the
the end of the block

startTime: the time at which the message should begin appearing
- values in the form HHMM, eg. 8:30AM = 0830, 1:20PM = 1320

endTime: the last time for which the message should appear (59th second)
- values in the form HHMM, eg. 8:30AM = 0830, 1:20PM = 1320

note: numbers starting with 0 less than 0778 will be converted to octal, so
omit the 0 unless necessary
*/
var blockTimes = [ // [displayText, startTime, endTime],
["The school day has not yet started", 0, 719],
["Block 1 (starts in %t minutes)", 720, 724],
["Block 1 (ends in %t minutes)", 725, 830],
["Block 2 (starts in %t minutes)", 831, 833],
["Block 2 (ends in %t minutes)", 834, 938],
["Advisory (ends in %t minutes)", 939, 1003],
["Block 3 (starts in %t minutes)", 1004, 1006],
["Block 3 (ends in %t minutes)", 1007, 1111],
["First Lunch (ends in %t minutes)", 1112, 1135],
["Second Lunch (starts in %t minutes)", 1136, 1144],
["Second Lunch (ends in %t minutes)", 1145, 1209],
["Third Lunch (starts in %t minutes)", 1210, 1218],
["Third Lunch (ends in %t minutes)", 1219, 1243],
["Block 5 (starts in %t minutes)", 1244, 1246],
["Block 5 (ends in %t minutes)", 1247, 1355],
["The school day has ended", 1356, 2359],
["", 2400, 2400] // used to prevent the last item from being skipped
];

// Converts a time from HHMM to a time (ms since 1970)
var formatTimeToMs = function(time) {
	var newTime = new Date();
	newTime.setHours(Math.floor(time / 100));
	newTime.setMinutes(time % 100);
	newTime.setSeconds(0);
	newTime.setMilliseconds(0);
	return newTime.getTime();
}


// Returns the current block (index of blockTimes) given a time (ms since 1970)
var getCurrentBlock = function(time) {
	var currentTime = time.getTime();
	var blockStart;
	var blockEnd;
	
	var i;
	for (i=0; i< blockTimes.length; i++) {
		blockStart = formatTimeToMs(blockTimes[i][1]);
		if (currentTime < blockStart) {
			i--;
			break;
		}
	}
	
	if (i === blockTimes.length) {
		return -1; // no block matches
	} else {
		blockEnd = formatTimeToMs(blockTimes[i][2]) + (1000 * 60); // add one minute to compensate for the one minute between each block start time
		if (currentTime < blockEnd) {
			return i;
		} else {
			return -1; // the block doesn't match
		}
	}
}

// Returns a string for the message that indicates the time left in the current block
var displayBlockMessage = function(block, time) {
	if (block !== -1) {
		var message = blockTimes[block][0];
		var currentTime = time.getTime();
		var endTime = formatTimeToMs(blockTimes[block][2]);
		
		var diffTime = Math.ceil((endTime + (60 * 1000) - currentTime) / (60 * 1000)); // adds one second to end time; divides by # to calculate minutes, not milliseconds
		
		return message.replace(/%t/, diffTime);
	} else {
		return "";
	}
}

/*
var exampleTime = new Date(2014, 2, 10); // for debugging, use Y, M-1, D
exampleTime.setHours(7);
exampleTime.setMinutes(25);
exampleTime.setSeconds(0);
console.log(exampleTime);
console.log(displayBlockMessage(2, exampleTime));
*/

var prevDate;

function load() {
	var today = new Date(); // for debugging, use Y, M-1, D
	getSchedules(today.getDate(), today.getMonth(), today.getFullYear());
	updateTime();
}

function updateTime() {
	var today = new Date();
	today.setSeconds(today.getSeconds() + 60);
	var weekday = weekdays[today.getDay()];
	var day = today.getDate();
	var month = today.getMonth();
	var monthName = months[month];
	var year = today.getFullYear();
	var h = today.getHours();
	var m = (today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes());
	var s = (today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds());
	document.getElementById("time").innerHTML = weekday + ", " + monthName + " " + day + ", " + year + " at " + (h > 12 ? h - 12 : h) + ":" + m + ":" + s + (h < 12 ? " AM" : " PM");
	if (isDayOff(day, month, year)) {
		document.getElementById("block").innerHTML = dayOffMsg(day, month, year);
	} else if (weekday === "Saturday" || weekday === "Sunday") {
		document.getElementById("block").innerHTML = "";
	} else {
		var currentBlock = getCurrentBlock(today);
		document.getElementById("block").innerHTML = displayBlockMessage(currentBlock, today);
	}
	/*
	if (isDayOff(day, month, year)) {
		document.getElementById("block").innerHTML = dayOffMsg(day, month, year);
	} else if (weekday === "Saturday" || weekday === "Sunday") {
		document.getElementById("block").innerHTML = "Have a great weekend!";
	} else if (h < 7) {
		document.getElementById("block").innerHTML = "School starts in " + (((7 - h) * 60) + (20 - m) > 60 ? Math.floor((((7 - h) * 60) + (20 - m)) / 60) + " hours and " : "") + ((((7 - h) * 60) + (20 - m)) % 60) + " minutes";
	} else if (h === 7 && m < 20) {
		document.getElementById("block").innerHTML = "Block 1 starts in " + (20 - m) + " minutes";
	} else if (h === 7 && m > 19) {
		document.getElementById("block").innerHTML = "Block 1 (ends in " + (60 + (30 - m)) + " minutes)";
	} else if (h === 8 && m < 30) {
		document.getElementById("block").innerHTML = "Block 1 (ends in " + (30 - m) + " minutes)";
	} else if (h === 8 && m > 29 && m < 34) {
		document.getElementById("block").innerHTML = "Block 2 starts in " + (34 - m) + " minutes";
	} else if (h === 8 && m > 33) {
		document.getElementById("block").innerHTML = "Block 2 (ends in " + (60 + (38 - m)) + " minutes)";
	} else if (h === 9 && m < 38) {
		document.getElementById("block").innerHTML = "Block 2 (ends in " + (38 - m) + " minutes)";
	} else if (h === 9 && m > 37) {
		document.getElementById("block").innerHTML = "Advisory (ends in " + (60 + (3 - m)) + " minutes)";
	} else if (h === 10 && m < 3) {
		document.getElementById("block").innerHTML = "Advisory (ends in " + (3 - m) + " minutes)";
	} else if (h === 10 && m > 2 && m < 7) {
		document.getElementById("block").innerHTML = "Block 3 starts in " + (7 - m) + " minutes";
	} else if (h === 10 && m > 8) {
		document.getElementById("block").innerHTML = "Block 3 (ends in " + (60 + (11 - m)) + " minutes)";
	} else if (h === 11 && m < 11) {
		document.getElementById("block").innerHTML = "Block 3 (ends in " + (11 - m) + " minutes)";
	} else if (h === 11 && m > 10 && m < 35) {
		document.getElementById("block").innerHTML = "Block 4 - First Lunch (ends in " + (35 - m) + " minutes)";
	} else if (h === 11 && m > 34 && m < 45) {
		document.getElementById("block").innerHTML = "Block 4 - Second Lunch starts in " + (45 - m) + " minutes";
	} else if (h === 11 && m > 44) {
		document.getElementById("block").innerHTML = "Block 4 - Second Lunch (ends in " + (60 + (9 - m)) + " minutes)";
	} else if (h === 12 && m < 9) {
		document.getElementById("block").innerHTML = "Block 4 - Second Lunch (ends in " + (9 - m) + " minutes)";
	} else if (h === 12 && m > 8 && m < 19) {
		document.getElementById("block").innerHTML = "Block 4 - Third Lunch starts in " + (19 - m) + " minutes";
	} else if (h === 12 && m > 18 && m < 43) {
		document.getElementById("block").innerHTML = "Block 4 - Third Lunch (ends in " + (43 - m) + " minutes)";
	} else if (h === 12 & m > 42 && m < 47) {
		document.getElementById("block").innerHTML = "Block 5 starts in " + (47 - m) + " minutes";
	} else if (h === 12 && m > 46) {
		document.getElementById("block").innerHTML = "Block 5 (ends in " + (60 + (50 - m)) + " minutes)";
	} else if (h === 13 && m < 50) {
		document.getElementById("block").innerHTML = "Block 5 (ends in " + (50 - m) + " minutes)";
	} else {
		document.getElementById("block").innerHTML = "The school day has ended!";
	}
	*/
	t = setTimeout(function(){updateTime()},1000);
}

function isDayOff(d, m, y) {
	for (i=0; i<specialDates.length; i++) {
		if (specialDates[i][0] === m + 1 && specialDates[i][1] === d && specialDates[i][2] === y) {
			return true;
		}
	}
	return false;
}

function dayOffMsg(d, m, y) {
	for (i=0; i<specialDates.length; i++) {
		if (specialDates[i][0] === m + 1 && specialDates[i][1] === d && specialDates[i][2] === y) {
			return specialDates[i][3];
		}
	}
}

var schedules = [];
schedules[0] = [1, 2, 3, 4, 5];
schedules[1] = [2, 5, 6, 7, 1];
schedules[2] = [3, 4, 5, 6, 7];
schedules[3] = [4, 6, 7, 1, 2];
schedules[4] = [5, 1, 2, 3, 4];
schedules[5] = [6, 7, 1, 2, 3];
schedules[6] = [7, 3, 4, 5, 6];

function getSchedules(day, month, year) {
	var oneDay = 24 * 60 * 60 * 1000;
	var startingDate = new Date(2013, 8, 2); // Year, month - 1, day of a 12345 day
	var startingUTC = startingDate.getTime();
	var endingDate = new Date(year, month, day);
	var endingUTC = endingDate.getTime();
	var diffDays = Math.round(Math.abs((startingUTC - endingUTC)/(oneDay))); // number of days between today's date and startingDate (12345 day)
	if (endingDate.getDay() === 0 || endingDate.getDay() === 6 || isDayOff(day, month, year)) {
	 	return; //it is a weekend / holiday
	} else {
		var j = 0; // this will be the number of holidays/weekends passed by
		if (diffDays > 6) {
			j = ((diffDays - (diffDays % 7)) / 7) * 2; //calculates number of weekend-days between the two days
		}
		var tempDate; //this will temporarily store a UTC date
		var tempUTC; // this will temporarily store a UTC time stamp
		for (k = 0; k < specialDates.length; k++) {
			tempDate = new Date(specialDates[k][2], specialDates[k][0] - 1, specialDates[k][1]);
				if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
				tempUTC = tempDate.getTime();
				if (tempUTC >= startingUTC && tempUTC < endingUTC) {
					j++; // if the holiday is between the given dates, then the number of non-school-days to be discounted is incremented
				}
			}
		}
		diffDays -= j; // subtracts number of weekend days, since they don't affect the schedule
		dayNumber = (diffDays % 7);
		
		document.getElementById("block1").innerHTML = schedules[dayNumber][0];
		document.getElementById("block2").innerHTML = schedules[dayNumber][1];
		document.getElementById("block3").innerHTML = schedules[dayNumber][2];
		document.getElementById("block4").innerHTML = schedules[dayNumber][3];
		document.getElementById("block5").innerHTML = schedules[dayNumber][4];
		return schedules[dayNumber];
	}
}

window.onload = function() {
	load();
}