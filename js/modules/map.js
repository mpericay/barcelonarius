/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['legend', 'timeslider', 'chart', 'cartodb', 'bootstrap'], function(legend, timeslider, chart) {
	
	var map = L.map('map', {
		center: [41.522, 1.986],
		zoom: 10,
		minZoom: 8,
		maxZoom: 18
	});
	//store layer and sublayer to play with
	var cartoSubLayer;
	var cartoLayer;

	var orto = L.tileLayer.wms("http://geoserveis.icc.cat/icc_mapesmultibase/noutm/wms/service?", {
		layers: 'ortogris',
		format: 'image/jpeg',
		continuousWorld: true,
		attribution: 'Institut Cartogràfic i Geològic de Catalunya -ICGC',
	});
	var topo = L.tileLayer.wms("http://geoserveis.icc.cat/icc_mapesmultibase/noutm/wms/service?", {
		layers: 'topogris',
		format: 'image/jpeg',
		continuousWorld: true,
		attribution: 'Institut Cartogràfic i Geològic de Catalunya -ICGC',
	});
	var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
	}).addTo(map);
	    
	var baseLayers = {
	    "Topogràfic": topo,
	    "Ortofotografia": orto,
		"Esquemàtic": positron
	};
	
	var sqlAPI = "https://ub.cartodb.com/api/v2/sql?";
	var table = "carimed_historic_data";
	
	var sql = "SELECT foto.link, e.tm, e.estacio, e.cartodb_id, e.the_geom_webmercator, b.ecostrimed, b.cabal, b.data::text, b.amoni, b.cond, b.nitrats, b.nitrits, b.fosfats, b.ihf, b.qbr, b.ibmwp, b.ibmwp_rang FROM estacions e INNER JOIN "
	+ table + " b ON e.estacio=b.estacio LEFT JOIN carimed_historic_fotos foto ON ((EXTRACT(YEAR FROM b.data)=foto.data_any) AND b.estacio=foto.estacio)";
		
	var buildYearWhere = function(value) {
		if( Object.prototype.toString.call(value) !== '[object Array]' ) {
			value = [value];
		}
		
		var sqlWhere;
		for(var i=0; i < value.length; i++) {
			sqlWhere = sqlWhere ? sqlWhere + " OR " : " WHERE ";
			sqlWhere += "b.data < '" + value[i] + "-07-01'::date AND b.data > '" + value[i] + "-01-01'";
		}
		return sqlWhere;
	};
	
	var setYear = function(value) {
		cartoSubLayer.setSQL(sql + buildYearWhere(value));
	};
	
	var openModal = function(div) {
		$(div).modal("show");
	};
	
	var getEvolution = function(id, estacio, param) {
		if (!param) param = legend.getActiveParamName();
		
		$.getJSON(sqlAPI + "callback=?",
            {
            q: "select " + param + " as param, EXTRACT(YEAR FROM data) AS year from estacions e INNER JOIN " + table + " b ON e.estacio=b.estacio where e.cartodb_id=" + id + " AND EXTRACT(MONTH FROM data) < 7 AND " + param + " IS NOT NULL ORDER BY year ASC"
            },
            function(data){
            // parse JSON data
			if(data) {
				if(data.total_rows) drawFigure(data.rows, param);
				else return("Error");
			}
        });
		
		$("#download").click(function() {
			getQuotes(estacio);
		});
		
		$("#downloadAll").click(function() {
			getQuotes();
		});
	};
	
	var drawFigure = function(data) {
		var div = "#modalFigure";
		openModal(div);
		var options = legend.getActiveParam();
		
		chart.create(div + " .modal-body", data, options);
		
	};
	
	var getQuotes = function(station, format){

		if(!format) format = "csv";
        
        var query = "select * from " + table;
        if(station) {
            query += " where estacio='"+station+"'";
        }
        var service = sqlAPI + "q=" + encodeURIComponent(query) + "&format=" + format;

        location.href = service;
    };
	
	var createTooltip = function(param, unit) {
		//delete tooltip
		var tooltip = cartoLayer.leafletMap.viz.getOverlay('tooltip');
		if(tooltip) tooltip.$el.remove();
		cartoLayer.leafletMap.viz.overlays = [];
		
		var template = '<div class="cartodb-tooltip-content-wrapper"><p>{{' + param + '}}';
		if(unit) template += ' ' + unit;
		template += '</p></div>';
		cartoLayer.leafletMap.viz.addOverlay({
		  type: 'tooltip',
		  layer: cartoSubLayer,
		  template: template, 
		  width: 50,
		  height: 20,
		  position: 'top|right',
		  fields: [{ name: param }]
		});		
	};
	
	// create a layer with 1 sublayer
	cartodb.createLayer(map, {
	  user_name: 'ub',
	  type: 'cartodb',
	  sublayers: [{
	    sql: sql + buildYearWhere(2015),
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
		 var fields = ['link', 'estacio', 'data', 'tm', 'cartodb_id'];
		 var params = legend.getAllParamNames();
		 fields = fields.concat(params);
		 
		 var fieldsTemplate = '<h4>data</h4><p>{{data}}</p><h4>municipi</h4><p>{{tm}}</p><h4>estacio</h4><p>{{estacio}}</p>';
		 
		 for(var i=0 ; i < params.length; i ++) {
			fieldsTemplate += '<h4>' + params[i]+ '</h4><p>{{' + params[i] + '}}</p>';
		 }
		 
		 var template = '<div class="cartodb-popup header with-image v2" data-cover="true"> <a href="#close" class="cartodb-popup-close-button close">x</a> <div class="cartodb-popup-header"> <div class="cover"> <div id="spinner"></div> <div class="image_not_found"> <i></i> <a href="#map" class="help">Non-valid picture URL</a></div>  <div class="shadow"></div> </div> </div> <div class="grafic-btn"><img src="/img/grafic-white.svg" style="margin-right: 5px; width: 20px;"><a class="figure">Gràfica i dades</a></div><div class="cartodb-popup-content-wrapper"> <div class="cartodb-popup-content"> {{#content.fields}} <div class="order{{index}}"> {{#index}} {{#title}}<h4>{{title}}</h4>{{/title}} {{#value}} <p>{{{ value }}}</p> {{/value}} {{^value}} <p class="empty">null</p> {{/value}} {{/index}} </div> {{/content.fields}} ' + fieldsTemplate + '</div> </div> <div class="cartodb-popup-tip-container"></div> </div>';
		 
	     cdb.vis.Vis.addInfowindow(map, cartoSubLayer, fields, {
			infowindowTemplate: template
		  });
		 
		 createTooltip(legend.getActiveParamName(), legend.getActiveParam().unit);
		 
		 cartoSubLayer.on('featureClick', function(e, latlng, pos, data) {
				$(".figure").data("id", data.cartodb_id);
				$(".figure").data("estacio", data.estacio);
				$(".figure").click(function() {
					getEvolution($(this).data("id"), $(this).data("estacio"));
				});
		  });
		 
		 layer.bind('loading', function() {
             $(".mapLoading").show()
         });
         layer.bind('load',  function() {
             $(".mapLoading").hide();
         });
		 
		 //layers control
		 var layersControl = L.control.layers(baseLayers, null).addTo(map);
		 addExtraLayers(layersControl);

     }).on('error', function(err) {
            console.log('cartoDBerror: ' + err);
     });
	
	// create more layers
	var addExtraLayers = function(layerControl) {
		//edar
		addOverlay(layerControl, "SELECT * FROM edar_2016", "#edar_2016{marker-file: url(http://com.cartodb.users-assets.production.s3.amazonaws.com/simpleicon/map51.svg);marker-fill-opacity: 0.9;marker-line-color: #FFF;marker-line-width: 1;marker-line-opacity: 1;marker-placement: point;marker-type: ellipse;marker-width: 8;marker-fill: #000000;marker-allow-overlap: true;}", "EDAR");
		//rius
		addOverlay(layerControl, "SELECT * FROM rius_barcelona", "#rius_barcelona{ line-color: #5CA2D1; line-width: 1.5; line-opacity: 0.7;}", "Rius", true);
		//embassaments
		addOverlay(layerControl, "SELECT * FROM embassaments_barcelona", "#embassaments_barcelona{polygon-fill: #5CA2D1;polygon-opacity: 0.7;line-color: #5CA2D1;line-width: 1;line-opacity: 0.7;}", "Embassaments", true);
		//provincia
		addOverlay(layerControl, "SELECT * FROM limits_provincia_barcelona", "#limits_provincia_barcelona{polygon-fill: #FFFFFF;polygon-opacity: 0;line-color: #000000;line-width: 1;line-opacity: 0.5;}", "Provincia", true);	
		//conques
		addOverlay(layerControl, "SELECT * FROM conques_barcelona", "#conques_barcelona{polygon-fill: #FF6600;polygon-opacity: 0;line-color: #6B0FB2;line-width: 0.2;line-opacity: 0.8;}#conques_barcelona::labels {text-name: [nom_conca_];text-face-name: 'DejaVu Sans Book';text-size: 9;text-label-position-tolerance: 0;text-fill: #6B0FB2;text-halo-fill: #FFF;text-halo-radius: 1;text-dy: -10;text-allow-overlap: true;text-placement: point;text-placement-type: dummy;}", "Conques");
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