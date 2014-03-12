var getLocalStorage = function() {
	if (typeof(Storage) !== "undefined") {
		if (localStorage.bgImage) {
			var bg = document.getElementById("background");
			bg.style.backgroundImage = 'url("' + localStorage.bgImage + '")';
		}
	}
}

var setLocalStorage = function(file) {
	if (typeof(Storage) !== "undefined") {
		if (localStorage.bgImage) {
			localStorage.bgImage = file;
		} else {
			localStorage.setItem("bgImage", file);
		}
	}
};

var changeBackground = function(evt) {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		var bgFile = evt.target.files[0]; // File object
		var reader = new FileReader(bgFile); // FileReader object
		
		var bg = document.getElementById("background");
		
		reader.onload = function() {
			bg.style.backgroundImage = 'url("' + reader.result + '")';
			setLocalStorage(reader.result);
		};
		
		reader.readAsDataURL(bgFile);
	} else {
		console.log('The File APIs are not fully supported in this browser.');
	}
};

var resetBackground = function(evt) {
	console.log("sup");
	if (typeof(Storage) !== "undefined") {
		if (localStorage.bgImage) {
			localStorage.removeItem("bgImage");
		}
		var bg = document.getElementById("background");
		bg.style.backgroundImage = 'url("bricks.jpg")';
	}
}

getLocalStorage();

document.getElementById("bgfile").addEventListener('change', changeBackground, false);
document.getElementById("reset").onclick = resetBackground;