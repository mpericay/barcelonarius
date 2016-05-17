/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['legend', 'timeslider', 'chart', 'cartodb', 'bootstrap'], function(legend, timeslider, chart) {
	
	var map = L.map('map').setView([41.522, 1.866], 10);
	var cartoSubLayer;

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
	
	var sql = "SELECT foto.link, e.tm, e.estacio, e.cartodb_id, b.data_any, b.epoca, e.the_geom_webmercator, b.ecostrimed, b.data, f.cond FROM estacions e INNER JOIN indexbio b ON e.estacio=b.estacio INNER JOIN fq f ON e.estacio=f.estacio LEFT JOIN carimedfotos2015 foto ON (b.data_any=foto.data_any AND b.epoca=foto.epoca)";
		
	var setYear = function(value) {
		if( Object.prototype.toString.call(value) !== '[object Array]' ) {
			value = [value];
		}
		
		var sqlWhere;
		for(var i=0; i < value.length; i++) {
			sqlWhere = sqlWhere ? sqlWhere + " OR " : " WHERE ";
			sqlWhere += "b.data < '" + value[i] + "-07-01'::date AND b.data > '" + value[i] + "-01-01'";
		}
		
		cartoSubLayer.setSQL(sql + sqlWhere);
	};
	
	var openModal = function(div) {
		$(div).modal("show");
		
	};
	
	var getEvolution = function(id, param) {
		if (!param) param = legend.getActiveParam();
		$.getJSON("https://ub.cartodb.com/api/v2/sql?callback=?",
            {
            q: "select " + param + " as param, data_any AS year from estacions e INNER JOIN indexbio b ON e.estacio=b.estacio where e.cartodb_id=" + id + " AND epoca=0 AND " + param + " IS NOT NULL ORDER BY data_any ASC"
            },
            function(data){
            // parse JSON data
			if(data) {
				if(data.total_rows) drawFigure(data.rows);
				else return("Error");
			}
        });
	};
	
	var drawFigure = function(data) {
		var div = "#modalFigure";
		openModal(div);
		chart.create(".modal-body", data);
	};
	
	// create a layer with 1 sublayer
	cartodb.createLayer(map, {
	  user_name: 'ub',
	  type: 'cartodb',
	  sublayers: [{
	    //sql: "SELECT e.estacio, e.cartodb_id,  e.the_geom_webmercator, b.ecostrimed, b.data FROM estacions e LEFT JOIN indexbio b ON e.estacio=b.estacio WHERE b.data < '2015-07-01'::date AND b.data > '2015-01-01'",
		sql: sql + " WHERE b.data < '2014-07-01'::date AND b.data > '2014-01-01'",
	    cartocss: '#estacions { marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 12; marker-allow-overlap: true; } #estacions[ecostrimed=1] { marker-fill: #5CA2D1;} #estacions[ecostrimed=2] { marker-fill: #33a02c; } #estacions[ecostrimed=3] { marker-fill: #FFCC00; } #estacions[ecostrimed=4] { marker-fill: #FF6600; } #estacions[ecostrimed=5] { marker-fill: #B81609; } #estacions[ecostrimed=null] { marker-fill: #FFFFFF; }',
        interactivity: 'cartodb_id'
	  }]
	}).addTo(map)
	
	.done(function(layer) {
	     layer.setZIndex(7);
		 cartoSubLayer = layer.getSubLayer(0);
		 legend.createSwitcher(map, cartoSubLayer, true);
		 timeslider.create(map, setYear);
	     // info window
	     // if we need a different template: http://requirejs.org/docs/download.html#text
		 //var template = '<div class="cartodb-popup header with-image v2" data-cover="true"><a href="#close" class="cartodb-popup-close-button close">x</a><div class="cartodb-popup-header"><div class="cover"><div id="spinner"></div><span class="separator"></span><h1 class="order1">{{data}}</h1><div class="shadow"></div><img src="{{link}}" style="height:138px" /></div></div><div class="cartodb-popup-content-wrapper"><div class="cartodb-popup-content"><h4>data</h4><p>{{data}}</p><h4>ecostrimed</h4><p>{{ecostrimed}}</p><h4>estacio</h4><p>{{estacio}}</p></div></div><div class="cartodb-popup-tip-container"></div></div>';
		 var fields = ['link', 'estacio', 'data', 'tm', 'ecostrimed', 'cartodb_id'];
		 var template = '<div class="cartodb-popup header with-image v2" data-cover="true"> <a href="#close" class="cartodb-popup-close-button close">x</a> <div class="cartodb-popup-header"> <div class="cover"> <div id="spinner"></div> <div class="image_not_found"> <i></i> <a href="#map" class="help">Non-valid picture URL</a></div>  <div class="shadow"></div> </div> </div> <div class="cartodb-popup-content-wrapper"> <div class="cartodb-popup-content"> {{#content.fields}} <div class="order{{index}}"> {{#index}} {{#title}}<h4>{{title}}</h4>{{/title}} {{#value}} <p>{{{ value }}}</p> {{/value}} {{^value}} <p class="empty">null</p> {{/value}} {{/index}} </div> {{/content.fields}} <h4>ecostrimed</h4><p>{{ecostrimed}}</p><h4>data</h4><p>{{data}}</p><h4>municipi</h4><p>{{tm}}</p><h4>estacio</h4><p>{{estacio}}</p><p><a class="figure">Veure gràfica</a></p></div> </div> <div class="cartodb-popup-tip-container"></div> </div>';
		 
	     cdb.vis.Vis.addInfowindow(map, cartoSubLayer, fields, {
			infowindowTemplate: template
		  });
		 
		 cartoSubLayer.on('featureClick', function(e, latlng, pos, data) {
				$(".figure").data("id", data.cartodb_id);
				$(".figure").click(function() {
					getEvolution($(this).data("id"));
				});
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