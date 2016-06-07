/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['params', 'cartodb', 'select'], function(params) {
    "use strict";
    
    var legendDiv;
    var activeParam = 'cond';
    var legends = params.getParams();
    
    var createLegend = function(sym, parent){
        if (typeof sym === "undefined") {
            $.each(legends, function(key, value) {           
                if (key == activeParam) {
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
            //$(sel).attr("data-size", 10);
            $.each(legends, function(key, value) {
                var option =  L.DomUtil.create( "option", "", sel );
                option.value = key;
                option.innerHTML = value.name;
                
                if (key == activeParam) {
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