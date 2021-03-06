var require = (function() {
	var scripts = document.getElementsByTagName('script');
	var HERE = scripts[scripts.length-1].src.replace(/[^\/]*$/, '');
	var LIB_PATH = HERE + "lib/";
	return {
		baseUrl: HERE + "modules/",
		paths: {
			"bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min",
            "css": LIB_PATH + "require-css/css",
			"slider": "//cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/6.1.5/bootstrap-slider.min",
            "cartodb": "//libs.cartocdn.com/cartodb.js/v3/3.15/cartodb",
            "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min",
			"select": "//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/js/bootstrap-select.min",
			"chartjs": "//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart"
		},
		shim: {
			"bootstrap": {
				deps: ["jquery", "css!https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"]
			},
			"cartodb" : {
				deps: ["css!//libs.cartocdn.com/cartodb.js/v3/3.15/themes/css/cartodb.css"]
			},
			"slider" : {
				deps: ["bootstrap", "css!//cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/6.1.5/css/bootstrap-slider.min.css"]
			},
			"select": {
				deps: ["bootstrap", "css!https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/css/bootstrap-select.min.css"]
			}
            
		}
	};
})();

