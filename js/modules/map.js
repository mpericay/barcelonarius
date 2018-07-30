/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['legend', 'timeslider', 'i18n', 'cartodb', 'bootstrap'], function(legend, timeslider, i18n) {
	
	var map = L.map('map', {
		center: [40, 0],
		zoom: 6,
		minZoom: 5,
		maxZoom: 18
		//scrollWheelZoom: false
	});
	//store layer and sublayer to play with
	var cartoSubLayer;
	var cartoLayer;
	var defaultYear = 2018;

	var orto = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    var terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18,
        ext: 'png'
    });
	var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
	}).addTo(map);
	    
	var baseLayers = {
	    "Map": positron,
	    "Ortophoto": orto,
		"Terrain": terrain
	};
	
	var sqlAPI = "https://ub.cartodb.com/api/v2/sql?";
	var table = "riunet_tot_marti";
		
	var sql = "SELECT cartodb_id, data::date||'' AS data, the_geom_webmercator, water_quality_points_text, eco_points_text, picture_name, regimen_hidrologico, estado_aquatico, bio_points_text, hidro_points_text FROM "
	+ table;
		
	var buildYearWhere = function(value) {
		if( Object.prototype.toString.call(value) !== '[object Array]' ) {
			value = [value];
		}
		
		var sqlWhere;
		for(var i=0; i < value.length; i++) {
			sqlWhere = sqlWhere ? sqlWhere + " OR " : " WHERE ";
			sqlWhere += "EXTRACT (YEAR FROM data) = " + value[i];
		}
		return sqlWhere;
	};
	
	var setYear = function(value) {
		cartoSubLayer.setSQL(sql + buildYearWhere(value));
	};
	
	var openModal = function(div) {
		$(div).modal("show");
	};
	
	var getQuotes = function(station, format){

		if(!format) format = "csv";
        
        var query = "select b.*, st_x(e.the_geom) as longitud, st_y(e.the_geom) as latitud from " + table;
		query += " b INNER JOIN estacions e ON e.estacio=b.estacio";
        if(station) {
            query += " where b.estacio='"+station+"'";
        }
        var service = sqlAPI + "q=" + encodeURIComponent(query) + "&format=" + format;

        location.href = service;
    };
	
	var createTooltip = function(id, param) {
		//delete tooltip
		var tooltip = cartoLayer.leafletMap.viz.getOverlay('tooltip');
		if(tooltip) tooltip.$el.remove();
		cartoLayer.leafletMap.viz.overlays = [];
		
		var template = '<div class="cartodb-tooltip-content-wrapper"><p>' + param.name+': {{' + id + '}}';
		if(param.unit) template += ' ' + param.unit;
		template += '</p></div>';
		cartoLayer.leafletMap.viz.addOverlay({
		  type: 'tooltip',
		  layer: cartoSubLayer,
		  template: template, 
		  width: 50,
		  height: 20,
		  position: 'top|right',
		  fields: [{ name: id }]
		});		
	};
	
	// create a layer with 1 sublayer
	cartodb.createLayer(map, {
	  user_name: 'ub',
	  type: 'cartodb',
	  sublayers: [{
	    sql: sql + buildYearWhere(defaultYear),
	    cartocss: legend.getActiveParam().cartoCSS,
        interactivity: 'cartodb_id'
	  }]
	}).addTo(map)
	
	.done(function(layer) {
	     layer.setZIndex(7);
		 cartoLayer = layer;
		 cartoSubLayer = layer.getSubLayer(0);
		 legend.createSwitcher(map, cartoSubLayer, true, createTooltip);
		 timeslider.create(map, setYear);
	     // info window
	     // if we need a different template: http://requirejs.org/docs/download.html#text
		 //var template = '<div class="cartodb-popup header with-image v2" data-cover="true"><a href="#close" class="cartodb-popup-close-button close">x</a><div class="cartodb-popup-header"><div class="cover"><div id="spinner"></div><span class="separator"></span><h1 class="order1">{{data}}</h1><div class="shadow"></div><img src="{{link}}" style="height:138px" /></div></div><div class="cartodb-popup-content-wrapper"><div class="cartodb-popup-content"><h4>data</h4><p>{{data}}</p><h4>ecostrimed</h4><p>{{ecostrimed}}</p><h4>estacio</h4><p>{{estacio}}</p></div></div><div class="cartodb-popup-tip-container"></div></div>';
		 var fields = ['picture_name', 'regimen_hidrologico', 'estado_aquatico', 'bio_points_text', 'hidro_points_text', 'data', 'cartodb_id'];
		 var params = legend.getAllParamNames();
		 fields = fields.concat(params);
		 
		 var fieldsTemplate = '<h4>'+i18n.t('Date')+'</h4><p>{{data}}</p><h4>'+i18n.t('Hidrologic status')+'</h4><p>{{regimen_hidrologico}}</p><h4>'+i18n.t('Aquatic status')+'</h4><p>{{estado_aquatico}}</p><h4>'+i18n.t('Hidrologic quality')+'</h4><p>{{water_quality_points_text}}</p><h4>'+i18n.t('Hidromorphologic quality')+'</h4><p>{{hidro_points_text}}</p><h4>'+i18n.t('Biologic quality')+'</h4><p>{{bio_points_text}}</p><h4>'+i18n.t('Ecologic status')+'</h4><p>{{eco_points_text}}</p>';
		 
		 var template = '<div class="cartodb-popup header with-image v2" data-cover="true"> <a href="#close" class="cartodb-popup-close-button close">x</a> <div class="cartodb-popup-header"> <div class="cover"> <div id="spinner"></div> <div class="image_not_found"> <i></i> <a href="#map" class="help">Non-valid picture URL</a></div>  <div class="shadow"></div> </div> </div> <div class="cartodb-popup-content-wrapper"> <div class="cartodb-popup-content"> {{#content.fields}} <div class="order{{index}}"> {{#index}} {{#title}}<h4>{{title}}</h4>{{/title}} {{#value}} <p>{{{ value }}}</p> {{/value}} {{^value}} <p class="empty">null</p> {{/value}} {{/index}} </div> {{/content.fields}} ' + fieldsTemplate + '</div> </div> <div class="cartodb-popup-tip-container"></div> </div>';
		 
	     cdb.vis.Vis.addInfowindow(map, cartoSubLayer, fields, {
			infowindowTemplate: template
		  });
		 
		 createTooltip(legend.getActiveParamName(), legend.getActiveParam());
		 
		 layer.bind('loading', function() {
             $(".mapLoading").show()
         });
         layer.bind('load',  function() {
             $(".mapLoading").hide();
         });
		 
		 //layers control
		 var layersControl = L.control.layers(baseLayers, null).addTo(map);
		 addExtraLayers(layersControl);
		 i18n.translateDocTree();

     }).on('error', function(err) {
            console.log('cartoDBerror: ' + err);
     });
	
	// create more layers
	var addExtraLayers = function(layerControl) {
		//edar
		//addOverlay(layerControl, "SELECT * FROM edar_2016", "#edar_2016{marker-file: url(http://com.cartodb.users-assets.production.s3.amazonaws.com/simpleicon/map51.svg);marker-fill-opacity: 0.9;marker-line-color: #FFF;marker-line-width: 1;marker-line-opacity: 1;marker-placement: point;marker-type: ellipse;marker-width: 8;marker-fill: #000000;marker-allow-overlap: true;}", "EDAR");
	};
     
    //create additional overlays
	var addOverlay = function(layerControl, sql, cartocss, title, visible) {
		var layer = cartodb.createLayer(map, {
			  user_name: 'ub',
			  type: 'cartodb',
			  sublayers: [{
				sql: sql,
				cartocss: cartocss
			  }]
			})
			.on('done', function(lyr) {
				layerControl.addOverlay(lyr, title);
		});
		
		if(visible) layer.addTo(map);
	};

});