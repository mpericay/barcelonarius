/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['legend', 'timeslider', 'chart', 'cartodb', 'bootstrap'], function(legend, timeslider, chart) {
	
	var map = L.map('map').setView([41.522, 1.866], 10);
	//store layer and sublayer to play with
	var cartoSubLayer;
	var cartoLayer;

	var orto = L.tileLayer.wms("http://geoserveis.icc.cat/icc_mapesbase/wms/service?", {
		layers: 'orto5m',
		format: 'image/jpeg',
		continuousWorld: true,
		attribution: 'Institut Cartogràfic i Geològic de Catalunya -ICGC',
	}).addTo(map);
	var topo = L.tileLayer.wms("http://geoserveis.icc.cat/icc_mapesbase/wms/service?", {
		layers: 'mtc250m',
		format: 'image/jpeg',
		continuousWorld: true,
		attribution: 'Institut Cartogràfic i Geològic de Catalunya -ICGC',
	});
	    
	var baseLayers = {
	    "Topogràfic": topo,
	    "Ortofotografia": orto
	};
	
	var sqlAPI = "https://ub.cartodb.com/api/v2/sql?";
	var table = "carimed_historic_data";
	
	var sql = "SELECT foto.link, e.tm, e.estacio, e.cartodb_id, e.the_geom_webmercator, b.ecostrimed, b.cabal, b.data, b.amoni, b.cond, b.nitrats, b.nitrits, b.fosfats, b.ihf, b.qbr, b.ibmwp, b.ibmwp_rang FROM estacions e INNER JOIN "
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
		 
		 var fieldsTemplate = '<a class="figure">Veure gràfica</a></p>';
		 fieldsTemplate += '<h4>data</h4><p>{{data}}</p><h4>municipi</h4><p>{{tm}}</p><h4>estacio</h4><p>{{estacio}}</p>';
		 
		 for(var i=0 ; i < params.length; i ++) {
			fieldsTemplate += '<h4>' + params[i]+ '</h4><p>{{' + params[i] + '}}</p>';
		 }
		 
		 var template = '<div class="cartodb-popup header with-image v2" data-cover="true"> <a href="#close" class="cartodb-popup-close-button close">x</a> <div class="cartodb-popup-header"> <div class="cover"> <div id="spinner"></div> <div class="image_not_found"> <i></i> <a href="#map" class="help">Non-valid picture URL</a></div>  <div class="shadow"></div> </div> </div> <div class="cartodb-popup-content-wrapper"> <div class="cartodb-popup-content"> {{#content.fields}} <div class="order{{index}}"> {{#index}} {{#title}}<h4>{{title}}</h4>{{/title}} {{#value}} <p>{{{ value }}}</p> {{/value}} {{^value}} <p class="empty">null</p> {{/value}} {{/index}} </div> {{/content.fields}} ' + fieldsTemplate + '</div> </div> <div class="cartodb-popup-tip-container"></div> </div>';
		 
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

     }).on('error', function(err) {
            console.log('cartoDBerror: ' + err);
     });
     
     //create additional overlays
     var conques =  L.tileLayer.wms("http://aca-web.gencat.cat/sig/wms/PUBLIC/CONQUES/Mapserver/WMSServer?", {
		layers: 'Conques_principals',
		format: 'image/png',
		transparent: true
	});
		
	var depuradores =  L.tileLayer.wms("http://sima.gencat.cat/DMAH_ws/SIMA_OGC/MapServer/WMSServer?", {
		layers: '2',
		format: 'image/png',
		transparent: true
	});
	
	var parcs =  L.tileLayer.wms("http://sima.gencat.cat/DMAH_ws/SIMA_OGC/MapServer/WMSServer?", {
		layers: '12',
		format: 'image/png',
		opacity: 0.5,
		transparent: true
	});	
		
	var rius =  L.tileLayer.wms("http://aca-web.gencat.cat/sig/wms/PUBLIC/CONQUES/MapServer/WMSServer?", {
		layers: 'Xarxa_de_rius_principal',
		format: 'image/png',
		transparent: true
	}).addTo(map);
	
	
	var overlayLayers = {
		'Parcs': parcs,
		'Rius': rius,
		'Conques': conques,
		'Depuradores': depuradores
	};
	
	L.control.layers(baseLayers, overlayLayers).addTo(map);
	
});