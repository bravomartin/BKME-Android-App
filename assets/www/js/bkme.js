var bkme = {
	'net' : {
		'connectionType' : null
	},
	'flags' : {
		'onCamera' : false
	}
};

var deviceInfo = function() {
    document.getElementById("platform").innerHTML = device.platform;
    document.getElementById("version").innerHTML = device.version;
    document.getElementById("uuid").innerHTML = device.uuid;
    document.getElementById("name").innerHTML = device.name;
    document.getElementById("width").innerHTML = screen.width;
    document.getElementById("height").innerHTML = screen.height;
    document.getElementById("colorDepth").innerHTML = screen.colorDepth;
};

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	//listeners
    document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackButton, false);
	
	checkConnection();
	startCamera(); 

	//hide everything
	$('#messages').children().hide();
	$('#app').children().hide();
	$('.ui-loader').hide();

	
	
	//status messages
	$('#geo').slideDown().delay(1500).slideUp();  
	$('#get').slideDown();

	
	//screens
	$('#welcome').show();
	$('#welcome').tap(function(){
	});

};

//app flow
function onResume(){
	$('#geo').slideDown().delay(1500).slideUp(); 
	if (!bkme.flags.onCamera){
		startCamera(); 	
		
	}

}
function onBackButton() {
	bkme.flags.onCamera = false;
	return false;
}




//camera
var startCamera = function(){
			bkme.flags.onCamera = true;
			navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, { quality: 50 }); 
};

var onPhotoSuccess = function(imageData) {
		var image = document.getElementById('photo');
	   	image.src = "data:image/jpeg;base64," + imageData;
	   	// $('#photo').src = image;
	   	$('#app').children().hide();
	   	$('#photoview').show();
	   	bkme.flags.onCamera = false;


};

var onPhotoFail = function(message) {
	$('.error').html('Img failed because: ' + message);
	$('.error').slideDown();
	bkme.flags.onCamera = false;

};

//external helpers
var beep = function() {
    navigator.notification.beep(2);
};

var vibrate = function() {
    navigator.notification.vibrate(0);
};

var checkConnection = function() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    app.connectionType = states[networkState];
};
