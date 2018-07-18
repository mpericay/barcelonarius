var require = (function() {
	var scripts = document.getElementsByTagName('script');
	var HERE = scripts[scripts.length-1].src.replace(/[^\/]*$/, '');
	var LIB_PATH = HERE + "lib/";
	return {
		baseUrl: HERE + "modules/",
		paths: {
			"bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min",
            "css": "//cdnjs.cloudflare.com/ajax/libs/require-css/0.1.10/css.min",
			"slider": "//cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/6.1.5/bootstrap-slider.min",
            "cartodb": "//libs.cartocdn.com/cartodb.js/v3/3.15/cartodb",
            "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min",
			"select": "//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/js/bootstrap-select.min"
		},
		shim: {
			"bootstrap": {
				deps: ["jquery", "css!//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"]
			},
			"cartodb" : {
				deps: ["css!//libs.cartocdn.com/cartodb.js/v3/3.15/themes/css/cartodb.css"]
			},
			"slider" : {
				deps: ["bootstrap", "css!//cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/6.1.5/css/bootstrap-slider.min.css"]
			},
			"select": {
				deps: ["bootstrap", "css!//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/css/bootstrap-select.min.css"]
			}
            
		}
	};
})();

