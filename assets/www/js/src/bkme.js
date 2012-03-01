var bkme = {
	'deviceInfo' : {},
	'flags' : {
		'onCamera' : false,
		'connection' : false,
		'gettingLocation' : false
	},
	'data' : {
		'geolocation' : {},
		'image' : null,
		'connectionType' : null

	},
	'fn' : {


	}

};

function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
	console.log('onLoad()');
}

function onDeviceReady() {
	console.log('onDeviceReady()');
	deviceInfo();

	//general listeners
	document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackButton, false);
	//hide everything
	$('#messages').children().hide();
	$('#app').children().hide();
	$('.ui-loader').hide();

	init();

}

//app flow
function onResume(){
	console.log('onResume()');
	init();
}



function init(){
	console.log('init()');

	checkConnection();
	
		checkLocation();
		if (!bkme.flags.onCamera){
			startCamera();
		} else {
			//status messages
		//	welcome();
		}

		//no connection!
		

}

function offlineMode () {
	if (!bkme.flags.connection) {
		if (!bkme.flags.offlineMode){
			$('.warning').html("Offline mode.");
			$('.warning').slideDown();
			bkme.flags.offlineMode = true;
		}
		setTimeout(function(){
			checkConnection();
		}, 120000);
	} else {
		$('.warning').slideUp();
		bkme.flags.offlineMode = false;

	}

}

function welcome(){
	$('#app').children().hide();
		$('#welcome').show();
		checkLocation();

		$('#get').slideDown();
		$('#welcome').tap(function(){
			console.log('tap!');
			startCamera();
		});
}


function displayPhoto(){
	$('#get').slideUp();
	$('#app').children().hide();
	var $photo = $('#photoview > #photo');
	$photo.attr( 'src', bkme.data.image);
	$photo.rotate(90);
	$photo.width(bkme.deviceInfo.height);
	$photo.css({'margin-top': -, 'margin-left' : -bkme.deviceInfo.width/3});

	// $photo.css('margin-left', -($photo.width()/2) );

	$('#photoview').show();
	//store the data in the database.
	//send the data!
	if(bkme.data.geolocation.valid){
		$('#photoview > #geolocation').html(bkme.data.geolocation.lat+","+bkme.data.geolocation.lon);
	}
	//sendReports();
		
}


function sendReports(){
	showMessage( $('#sending'), 3000 );
	vibrate();
	var reset = setTimeout(function(){welcome();}, 5000);
	
}

function onBackButton() {
	bkme.flags.onCamera = false;
	console.log('offCamera');

	return false;
}

function showMessage(m, wait){
	wait = wait || 1500;
	m.slideDown().delay(wait).slideUp();
}


//camera
var startCamera = function(){
	bkme.flags.onCamera = true;
	console.log('onCamera');
	navigator.camera.getPicture(
		onPhotoSuccess,
		onPhotoFail,
		{ quality: 50,
		allowEdit : true,
		targetWidth: 1000,
		targetHeight: 1000
		});
};

var onPhotoSuccess = function(imageData) {
		console.log('onPhotoSucess()');
		bkme.data.image = "data:image/jpeg;base64," + imageData;
		bkme.flags.onCamera = false;
		console.log('offCamera');
		displayPhoto();


};

var onPhotoFail = function(message) {
	$('.error').html(message);
		showMessage( $('.error') );
	bkme.flags.onCamera = false;
	console.log('offCamera');
	welcome();


};


//geolocation

var checkLocation = function() {

	var success = function(p) {
		bkme.flags.gettingLocation = false;
		bkme.data.geolocation = {
			'lat' : p.coords.latitude,
			'lon' : p.coords.longitude,
			'accuracy' : p.coords.accuracy,
			'valid' : true
		};

		for(var d in bkme.data.geolocation){
			console.log(d + ' : ' + bkme.data.geolocation[d]);
		}
		var obsolete = setTimeout(
			function() {
				obsoleteGeo();
			},
			90000);
		var loc =	'location found: ' +
					bkme.data.geolocation.lat +
					',' +
					bkme.data.geolocation.lat +
					'~' +
					bkme.data.geolocation.accuracy;

		$('#geo').html(loc);
		$('#gettingGeo').slideUp();
		showMessage( $('#geo '), 3000 );
	};
	var fail = function(error) {

		bkme.flags.gettingLocation = false;
		bkme.data.geolocation = {};

        switch (error.code) {

		case error.POSITION_UNAVAILABLE:
			$('.error').html("Could not detect current position.");
			showMessage($('.error'));
			break;

		case error.TIMEOUT:
			$('.error').html("Retrieving position timed out.");
			showMessage($('.error'));
			break;

		default:
			$('.error').html("Unknown error.");
			showMessage($('.error'));
			break;
		}
	};
	var obsoleteGeo = function(){
		bkme.data.geolocation.valid = false;
		console.log("valid : " + bkme.data.geolocation.valid);
	};

	if( !bkme.flags.gettingLocation && !bkme.data.geolocation.valid ) {
		$('#gettingGeo').slideDown();
		navigator.geolocation.getCurrentPosition(success, fail);
		bkme.flags.gettingLocation = true;
	}
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
	console.log('networkState : ' + networkState);
	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.NONE]     = 'No network connection';

	bkme.data.connectionType = states[networkState];
	if ( networkState != Connection.NONE ) {
		bkme.flags.connection = true;
	} else {
		bkme.flags.connection = false;
	}
	offlineMode();

	return;
};

var deviceInfo = function() {
	bkme.deviceInfo.platform = device.platform;
	bkme.deviceInfo.version = device.version;
	bkme.deviceInfo.uuid = device.uuid;
	bkme.deviceInfo.name = device.name;
	bkme.deviceInfo.width = screen.width;
	bkme.deviceInfo.height = screen.height;
	bkme.deviceInfo.colorDepth = screen.colorDepth;
	console.log(device.platform);
	for(var p in bkme.deviceInfo){
		console.log(p + ' : ' + bkme.deviceInfo[p]);
	}
};
