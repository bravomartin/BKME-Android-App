var BKME = ( function (bk, $) {

	bk.modules = bk.modules || {};
	
	// global setting variables go here
	bk.settings = {
			initialized: false
		};
	
	bk.evt = {
			'ready': function( evt ) {
				if ( 'app' in bkme ) {
					bkme.app.run();
				}

			}//,
			// 'onDeviceReady' : function(){
			//	if ( 'app' in bkme ) {
			//		bkme.app.run();
			//	}
			// }
	};
	bk.fn = {
		'init': function(){
			if ( bk.settings.initialized ) return false;
			// bindings
			$( window )
				.unbind( 'keydown.bk keypress.bk keyup.bk' ) //unbinding for safety.
				.bind( 'keydown.bk keypress.bk keyup.bk', function( e ) {
					
					return bk.fn.trigger( e.type, e );
				} );
			// if we've got the throttle plugin, use it
			
			$( document )
				.unbind( 'ready.bk' )
				.bind( 'ready.bk', function( e ) {
					return bk.fn.trigger( e.type, e );
				} )
				.bind( 'deviceready.bk', function( e ) {
					return bk.fn.trigger( e.type, e );
				} );

				
			// attempt to set our base url based on where this script lives
			// assumes this script is being packaged into a script that lives in {base_url}/js/{package_name}.js
			var baseSrc = "/"; // default to nada
			$( 'script[src^="/"]' ).each( function() {
				$script = $( this );
				if( $script.attr( 'src' ).match( /^\/{1}[a-zA-Z0-9]+/ ) &&
					$script.attr( 'src' ).match( /^.*?(?=js\/[a-zA-Z0-9\_\-]+\.js)/ ) ) {
					baseSrc = $script.attr( 'src' ).match( /^.*?(?=js\/[a-zA-Z0-9\_\-]+\.js)/ )[0];
				}
			} );
			bk.fn.set( 'base_url', baseSrc );
			// load modules

			bk.settings.initialized = true;

		},
		'trigger': function( eventName, eventObj, args ) {
			// Add some assurances to our eventObj
			if( typeof eventObj == "undefined" )
				eventObj = { 'type': 'custom' };

			// trigger the global handlers first
			if ( eventName in bkme.evt ) {
				// if it returns false, stop the train
				if ( bk.evt[eventName]( eventObj ) === false ) {
					return false;
				}
			}
			// run the event handler on each module that's got it
			for( var module in bkme.modules ) {
				if( module in bkme.modules && 'evt' in bkme.modules[module] && eventName in bkme.modules[module].evt ) {
					bk.modules[module].evt[eventName]( eventObj, args );
				}
			}
		},
		
		// Adds a variable to the GS global settings
		'set': function( key, value ) {
			bkme.settings[key] = value;
			return value;
		},
		// returns a variable from the GS global settings
		// defaults to the key if the variable can't be found
		'get': function( key ) {
			if( key in bkme.settings ) {
				return bkme.settings[key];
			} else {
				return key;
			}
		}
		

	};
	
	
	bkme.fn.init();
	
	
	return bkme;
}(BKME || {}, jQuery));





