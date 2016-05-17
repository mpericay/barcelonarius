/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['cartodb', 'select'], function() {
    "use strict";

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
    
    var condLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (cond)",
        data: [
          { name: "Molt mineralitzades", value: "#F03B20" },
          { name: "Mitjanament mineral.", value: "#FEB24C" },
          { name: "Poc mineralitzades", value: "#FFEDA0" }
        ]
    });
    
    var legends = {
        'cond': {
            cdbLegend: condLegend,
            cartoCSS: '#estacions{ marker-fill-opacity: 0.8;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-width: 12;  marker-fill: #FFEDA0; marker-allow-overlap: true;} #estacions [ cond <= 9550] { marker-fill: #F03B20; } #estacions [ cond <= 1356.5] { marker-fill: #FEB24C; } #estacions [ cond <= 580.5] { marker-fill: #FFEDA0; }',
            name: "Conductivitat"
        },
        'ecostrimed': {
            cdbLegend: ecostLegend,
            cartoCSS: '#estacions { marker-fill-opacity: 0.9; marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;      marker-placement: point;      marker-type: ellipse;      marker-width: 12;      marker-allow-overlap: true;   }      #estacions[ecostrimed=1] {      marker-fill: #5CA2D1;   }   #estacions[ecostrimed=2] {      marker-fill: #33a02c;   }   #estacions[ecostrimed=3] {      marker-fill: #FFCC00;   }   #estacions[ecostrimed=4] {      marker-fill: #FF6600;   }   #estacions[ecostrimed=5] {      marker-fill: #B81609;   }   #estacions[ecostrimed=null] {      marker-fill: #FFFFFF;   }  ',
            name: "Ecostrimed",
            active: true
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