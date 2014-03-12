var changeBackground = function(evt) {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		var bgFile = evt.target.files[0]; // File object
		var reader = new FileReader(bgFile); // FileReader object
		
		var bg = document.getElementById("background");
		
		reader.onload = function(file) {
			bg.style.backgroundImage = 'url("' + reader.result + '")';
		};
		
		reader.readAsDataURL(bgFile);
	} else {
		console.log('The File APIs are not fully supported in this browser.');
	}
}

document.getElementById("bgfile").addEventListener('change', changeBackground, false);