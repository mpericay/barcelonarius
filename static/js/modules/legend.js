/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['cartodb'], function() {
    "use strict";

    var ecostLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (ecost)",
        data: [
          { name: "Molt bona",          value: "#B81609" },
          { name: "Bona",         value: "#FF6600" },
          { name: "Moderada",         value: "#FFCC00" },
          { name: "Mediocre",       value: "#33a02c" },
          { name: "Pèssima",  value: "#5CA2D1" }
        ]
    });
    
    var condLegend = new cdb.geo.ui.Legend.Custom({
        title: "Llegenda (cond)",
        data: [
          { name: "Molt mineralitzades",          value: "#B81609" },
          { name: "Mitjanament mineral.",         value: "#FFCC00" },
          { name: "Poc mineralitzades",  value: "#5CA2D1" }
        ]
    });
    
    var legends = {
        'cond': {
            cdbLegend: condLegend,
            cartoCSS: '#estacions {      marker-fill-opacity: 0.9;      marker-line-color: #FFF;      marker-line-width: 1;      marker-line-opacity: 1;      marker-placement: point;      marker-type: ellipse;      marker-width: 10;      marker-allow-overlap: true;   }      #estacions[ecostrimed=1] {      marker-fill: #5CA2D1;   }   #estacions[ecostrimed=2] {      marker-fill: #33a02c;   }   #estacions[ecostrimed=3] {      marker-fill: #FFCC00;   }   #estacions[ecostrimed=4] {      marker-fill: #FF6600;   }   #estacions[ecostrimed=5] {      marker-fill: #B81609;   }   #estacions[ecostrimed=null] {      marker-fill: #FFFFFF;   }  ',
            name: "Conductivitat"
        },
        'ecost': {
            cdbLegend: ecostLegend,
            cartoCSS: '#estacions {      marker-fill-opacity: 0.9;      marker-line-color: #FFF;      marker-line-width: 1;      marker-line-opacity: 1;      marker-placement: point;      marker-type: ellipse;      marker-width: 10;      marker-allow-overlap: true;   }      #estacions[ecostrimed=1] {      marker-fill: #5CA2D1;   }   #estacions[ecostrimed=2] {      marker-fill: #33a02c;   }   #estacions[ecostrimed=3] {      marker-fill: #FFCC00;   }   #estacions[ecostrimed=4] {      marker-fill: #FF6600;   }   #estacions[ecostrimed=5] {      marker-fill: #B81609;   }   #estacions[ecostrimed=null] {      marker-fill: #FFFFFF;   }  ',
            name: "Ecostrimed",
            active: true
        }
    };
    
    var showLegend = function(sym){
        if (typeof sym === "undefined") {
            $.each(legends, function(key, value) {           
                if (legends[key].active) {
                    sym = key;
                }
            });
        }
        //legends[sym].cdbLegend.addTo("#legends");
        //legends[sym].cdbLegend.render().el.remove();
        $('#legends').empty();
        $('#legends').append(legends[sym].cdbLegend.render().el);
    };

    var createSwitcher = function(map, cssCallback, withLegend) {    
        var switcher = L.control({position: "bottomright"});
        switcher.onAdd = function(map) {
            var combo = L.DomUtil.create( "div", "cssSelector");
            var sel =  L.DomUtil.create( "select", "form-control", combo );
            $.each(legends, function(key, value) {
                var option =  L.DomUtil.create( "option", "", sel );
                option.value = key;
                option.innerHTML = value.name;
                
                if (legends[key].active) {
                    if(withLegend) showLegend(key);
                    option.selected = "selected";
                }
            });
            
            $(sel).change(function() {
                if(withLegend) showLegend(this.value);
                cssCallback(legends[this.value].cartoCSS);
            });                
            
            return combo;
        };
        switcher.addTo(map);
    };
    
	return {
       createSwitcher: function(map, cb) {
       		return createSwitcher(map, cb, true);
       },
       createLegend: function(sym) {
       		return showLegend(sym);
       }
	};
	
});