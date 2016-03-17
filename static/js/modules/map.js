/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['legend', 'cartodb'], function(legend) {
	
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
	    cartocss: '#estacions { marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 10; marker-allow-overlap: true; } #estacions[ecostrimed=1] { marker-fill: #5CA2D1;} #estacions[ecostrimed=2] { marker-fill: #33a02c; } #estacions[ecostrimed=3] { marker-fill: #FFCC00; } #estacions[ecostrimed=4] { marker-fill: #FF6600; } #estacions[ecostrimed=5] { marker-fill: #B81609; } #estacions[ecostrimed=null] { marker-fill: #FFFFFF; }',
        interactivity: 'cartodb_id'
	  }]
	}).addTo(map)
	
	.done(function(layer) {
	     layer.setZIndex(7);
		 legend.createSwitcher(map, layer.getSubLayer(0), true);
	     // info window
	     // if we need a different template: http://requirejs.org/docs/download.html#text
	     /*var sublayer = layer.getSubLayer(0);
	     sublayer.infowindow.set('template', $('#infowindow_template').html());*/
	     cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['ecostrimed', 'cond', 'data', 'cartodb_id']);
     }).on('error', function(err) {
            console.log('cartoDBerror: ' + err);
     });
     
     //create additional overlays
     var hillshade2 =  L.tileLayer.wms("http://www.opengis.uab.cat/cgi-bin/world/MiraMon.cgi?", {
		layers: 'glcc-world',
		format: 'image/png',
		opacity: 0.40,
		transparent: true,
	});
		
	var temperature =  L.tileLayer.wms("http://spatial-dev.ala.org.au/geoserver/wms?", {
		layers: 'worldclim_bio_5',
		format: 'image/png',
		opacity: 0.40,
		transparent: true,
		/*http://spatial-dev.ala.org.au/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=worldclim_bio_5*/
	});
		
	var rain =  L.tileLayer.wms("http://spatial-dev.ala.org.au/geoserver/wms?", {
		layers: 'worldclim_bio_12',
		format: 'image/png',
		opacity: 0.40,
		transparent: true,
		/*http://spatial-dev.ala.org.au/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=worldclim_bio_12*/
	});
	
	
	var overlayLayers = {
		'Annual temperature': temperature,
		'Annual rain': rain,
		'Land Cover': hillshade2
		};
	
	L.control.layers(baseLayers, null).addTo(map);	
	
});