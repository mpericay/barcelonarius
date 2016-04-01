/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['legend', 'timeslider', 'cartodb', 'bootstrap'], function(legend) {
	
	var map = L.map('map').setView([41.522, 1.866], 10);

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
	    
	// create a layer with 1 sublayer
	var cartoLayer = cartodb.createLayer(map, {
	  user_name: 'ub',
	  type: 'cartodb',
	  sublayers: [{
	    //sql: "SELECT e.estacio, e.cartodb_id,  e.the_geom_webmercator, b.ecostrimed, b.data FROM estacions e LEFT JOIN indexbio b ON e.estacio=b.estacio WHERE b.data < '2015-07-01'::date AND b.data > '2015-01-01'",
		sql: "SELECT e.estacio, e.cartodb_id,  e.the_geom_webmercator, b.ecostrimed, b.data, f.cond FROM estacions e INNER JOIN indexbio b ON e.estacio=b.estacio INNER JOIN fq f ON e.estacio=f.estacio WHERE b.data < '2014-07-01'::date AND b.data > '2014-01-01'",
	    cartocss: '#estacions { marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 12; marker-allow-overlap: true; } #estacions[ecostrimed=1] { marker-fill: #5CA2D1;} #estacions[ecostrimed=2] { marker-fill: #33a02c; } #estacions[ecostrimed=3] { marker-fill: #FFCC00; } #estacions[ecostrimed=4] { marker-fill: #FF6600; } #estacions[ecostrimed=5] { marker-fill: #B81609; } #estacions[ecostrimed=null] { marker-fill: #FFFFFF; }',
        interactivity: 'cartodb_id'
	  }]
	}).addTo(map)
	
	.done(function(layer) {
	     layer.setZIndex(7);
		 var sublayer = layer.getSubLayer(0);
		 legend.createSwitcher(map, sublayer, true);
	     // info window
	     // if we need a different template: http://requirejs.org/docs/download.html#text
	     cdb.vis.Vis.addInfowindow(map, sublayer, ['ecostrimed', 'cond', 'data', 'cartodb_id']);
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