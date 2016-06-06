/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['cartodb', 'select'], function() {
    "use strict";

    var amoniLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (amoni)",
        data: [
          { name: "Molt mineralitzades", value: "#B81609" },
          { name: "Mitjanament mineral.", value: "#FFCC00" },
          { name: "Poc mineralitzades", value: "#0080ff" }
        ]
    });
    
    var cabalLegend = new cdb.geo.ui.Legend.Bubble({
              title: "Llegenda (cabal)",
              min: 1, max: 150, color: "#5CA2D1"
            });
        
    var condLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (cond)",
        data: [
          { name: "Molt mineralitzades", value: "#B81609" },
          { name: "Mitjanament mineral.", value: "#FFCC00" },
          { name: "Poc mineralitzades", value: "#0080ff" }
        ]
    });
    
    var ecostLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (ecost)",
        data: [
          { name: "Molt bona", value: "#5CA2D1" },
          { name: "Bona", value: "#33a02c" },
          { name: "Moderada", value: "#FFCC00" },
          { name: "Mediocre", value: "#FF6600" },
          { name: "Pèssima", value: "#B81609" }
        ]
    });
    
    var nitratsLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (nitrats)",
        data: [
          { name: "Molt mineralitzades", value: "#B81609" },
          { name: "Mitjanament mineral.", value: "#FFCC00" },
          { name: "Poc mineralitzades", value: "#0080ff" }
        ]
    });
    
    var nitritsLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (nitrits)",
        data: [
          { name: "Molt mineralitzades", value: "#B81609" },
          { name: "Mitjanament mineral.", value: "#FFCC00" },
          { name: "Poc mineralitzades", value: "#0080ff" }
        ]
    });
    
    var fosfatsLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (fosfats)",
        data: [
          { name: "Molt mineralitzades", value: "#B81609" },
          { name: "Mitjanament mineral.", value: "#FFCC00" },
          { name: "Poc mineralitzades", value: "#0080ff" }
        ]
    });
    
    var ihfLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (IHF)",
        data: [
          { name: "Molt mineralitzades", value: "#B81609" },
          { name: "Mitjanament mineral.", value: "#FFCC00" },
          { name: "Poc mineralitzades", value: "#0080ff" }
        ]
    });
    
    var qbrLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (QBR)",
        data: [
          { name: "Molt mineralitzades", value: "#B81609" },
          { name: "Mitjanament mineral.", value: "#FFCC00" },
          { name: "Poc mineralitzades", value: "#0080ff" }
        ]
    });
    
    var IBMWPLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (IBMWP)",
        data: [
          { name: "Molt bona", value: "#5CA2D1" },
          { name: "Bona", value: "#33a02c" },
          { name: "Moderada", value: "#FFCC00" },
          { name: "Mediocre", value: "#FF6600" },
          { name: "Pèssima", value: "#B81609" }
        ]
    });    
    
    var legends = {
        'amoni': {      
            cdbLegend: amoniLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8; marker-line-color: #FFF; marker-line-width: 1;marker-line-opacity: 1; marker-width: 10; marker-fill: #b7b7b7;marker-allow-overlap: true;}#estacions [ amoni >= 4.0] { marker-fill: #B81609;} #estacions [ amoni < 4.0] {marker-fill: #FF6600;} #estacions [ amoni <= 0.9] { marker-fill: #FFCC00;}#estacions [ amoni <= 0.4] { marker-fill: #229A00;} #estacions [ amoni <= 0.09] {marker-fill: #0080ff;}',
            name: "Amoni",
            maxvalue: 10
        },
        'cabal': {
            cdbLegend: cabalLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-multi-policy: largest; marker-type: ellipse; marker-fill: #5CA2D1; marker-allow-overlap: true; marker-clip: false;} #estacions [cabal > 150] { marker-width: 25.0;} #estacions [ cabal <= 150] {   marker-width: 20;} #estacions [ cabal <= 100] {   marker-width: 15;} #estacions [ cabal <= 50] {   marker-width: 10;} #estacions [ cabal <= 10] {   marker-width: 7;} #estacions [ cabal <= 1] {   marker-width: 5;} #estacions [ cabal = -2] {   marker-width: 10;  marker-fill: #b7b7b7;} #estacions [ cabal = -1] {   marker-width: 7;  marker-fill: #000000;}',
            name: "Cabal",
            maxvalue: 1000            
        },
        'cond': {
            cdbLegend: condLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-width: 12;  marker-fill: #b7b7b7; marker-allow-overlap: true;} #estacions [ cond > 1000] { marker-fill: #B81609; } #estacions [ cond <= 1000] { marker-fill: #FFCC00; } #estacions [ cond <= 100] { marker-fill: #0080ff; }',
            name: "Conductivitat",
            maxvalue: 5000
        },
        'ecostrimed': {
            cdbLegend: ecostLegend,
            cartoCSS: '#estacions { marker-fill-opacity: 0.9; marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;      marker-placement: point;      marker-type: ellipse;      marker-width: 12;      marker-allow-overlap: true;   }      #estacions[ecostrimed=1] {      marker-fill: #5CA2D1;   }   #estacions[ecostrimed=2] {      marker-fill: #33a02c;   }   #estacions[ecostrimed=3] {      marker-fill: #FFCC00;   }   #estacions[ecostrimed=4] {      marker-fill: #FF6600;   }   #estacions[ecostrimed=5] {      marker-fill: #B81609;   }   #estacions[ecostrimed=null] {      marker-fill: #FFFFFF;   }  ',
            name: "Ecostrimed",
            maxvalue: 6,
            active: true
        },
        'nitrats': {
            cdbLegend: nitratsLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-width: 10; marker-fill: #b7b7b7; marker-allow-overlap: true;} #estacions [ nitrats > 10] { marker-fill: #B81609;} #estacions [ nitrats <= 10] { marker-fill: #FFCC00;} #estacions [ nitrats <= 0.67] { marker-fill: #0080ff;}',
            name: "Nitrats",
            maxvalue: 2
        },
        'nitrits': {
            cdbLegend: nitritsLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-width: 10; marker-fill: #b7b7b7; marker-allow-overlap: true;} #estacions [ nitrits > 10] { marker-fill: #B81609;} #estacions [ nitrits <= 10] { marker-fill: #FFCC00;} #estacions [ nitrits <= 0.67] { marker-fill: #0080ff;}',
            name: "Nitrits",
            maxvalue: 2
        },
        'fosfats': {
            cdbLegend: fosfatsLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-width: 10; marker-fill: #b7b7b7; marker-allow-overlap: true;} #estacions [ fosfats >= 0.5] {   marker-fill: #B81609;} #estacions [ fosfats < 0.5] {   marker-fill: #FF6600;} #estacions [ fosfats <= 0.3] {   marker-fill: #FFCC00;} #estacions [ fosfats <= 0.1] {   marker-fill: #229A00;} #estacions [ fosfats <= 0.03] {   marker-fill: #0080ff;}',
            name: "Fosfats",
            maxvalue: 10
        },
        'IHF': {
            cdbLegend: ihfLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-width: 10; marker-fill: #b7b7b7; marker-allow-overlap: true;} #estacions [ ihf < 40] {   marker-fill: #B81609;} #estacions [ ihf > 40] {   marker-fill: #FFCC00;} #estacions [ ihf > 60] {   marker-fill: #0080ff;} #estacions [ ihf = -1] {   marker-fill: #abacad;}',
            name: "IHF",
            maxvalue: 100
        },
        'QBR': {
            cdbLegend: qbrLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-width: 10; marker-fill: #b7b7b7; marker-allow-overlap: true;} #estacions [ qbr <= 25] { marker-fill: #B81609;} #estacions [ qbr >= 30] { marker-fill: #FF6600;} #estacions [ qbr >= 55] { marker-fill: #FFCC00;} #estacions [ qbr >= 75] { marker-fill: #229A00;} #estacions [ qbr >= 100] { marker-fill: #0080ff;}',
            name: "QBR",
            maxvalue: 100
        },
        'IBMWP': {
            cdbLegend: IBMWPLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-width: 10; marker-fill: #b7b7b7; marker-allow-overlap: true;} #estacions [ibmwp_rang=1] {   marker-fill: #3E7BB6;} #estacions [ibmwp_rang=2] {   marker-fill: #33a02c;} #estacions [ibmwp_rang=3] {   marker-fill: #FFCC00;} #estacions [ibmwp_rang=4] {   marker-fill: #FF6600;} #estacions [ibmwp_rang=5] {   marker-fill: #B81609;} #estacions [ibmwp_rang=-1] {   marker-fill: #9b9b9b;} #estacions [ibmwp_rang=null] {   marker-fill: #FFFFFF;}',
            name: "IBMWP",
            maxvalue: 150
        }
    };
    
    var legendDiv;
    var activeParam;
    
    var createLegend = function(sym, parent){
        if (typeof sym === "undefined") {
            $.each(legends, function(key, value) {           
                if (legends[key].active) {
                    sym = key;
                }
            });
        }

        legendDiv = L.DomUtil.create( "div", "legend", parent);
        setLegend(sym);
    };
    
    var setLegend = function(sym) {
        if (!legendDiv) return;
        $(legendDiv).empty();
        $(legendDiv).append(legends[sym].cdbLegend.render().el);
    }

    var createSwitcher = function(map, sublayer, withLegend) {    
        var switcher = L.control({position: "bottomright"});
        switcher.onAdd = function(map) {
            var combolegend = L.DomUtil.create( "div", "combolegend");
            var combo = L.DomUtil.create( "div", "cssSelector", combolegend);
            var sel =  L.DomUtil.create( "select", "form-control dropup", combo );
            $.each(legends, function(key, value) {
                var option =  L.DomUtil.create( "option", "", sel );
                option.value = key;
                option.innerHTML = value.name;
                
                if (legends[key].active) {
                    if(withLegend) createLegend(key, combolegend);
                    activeParam = key; 
                    option.selected = "selected";
                }
            });
            
            $(sel).change(function() {
                if(withLegend) setLegend(this.value);
                activeParam = this.value; 
                sublayer.setCartoCSS(legends[this.value].cartoCSS);
                //sublayer.infowindow.set('template', legends[this.value].template);
            });
            
            // make select responsive and mobile-friendly with https://silviomoreto.github.io/bootstrap-select/
            $(sel).selectpicker({
                style: 'btn-primary',
                size: 4
            });
            
            return combolegend;
        };
        switcher.addTo(map);
        
    };
    
	return {
       createSwitcher: function(map, sublayer, withLegend) {
       		return createSwitcher(map, sublayer, withLegend);
       },
       getLegend: function() {
       		return legends[activeParam];
       },
       setActiveParam: function(value) {
            activeParam = value;
        },
        getActiveParam: function() {
            return activeParam;
        }
	};
	
});