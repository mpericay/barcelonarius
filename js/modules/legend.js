/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['params', 'cartodb', 'select'], function(paramsFile) {
    "use strict";
    
    var legendDiv;
    var activeParam = 'ecostrimed';
    var params = paramsFile.getParams();
    
    var createLegend = function(sym, parent){
        if (typeof sym === "undefined") {
            $.each(params, function(key, value) {           
                if (key == activeParam) {
                    sym = key;
                }
            });
        }

        legendDiv = L.DomUtil.create( "div", "legend", parent);
        disableEvent(legendDiv, 'click');
        disableEvent(legendDiv, 'dblclick');
        setLegend(sym);
    };
    
    var setLegend = function(sym) {
        if (!legendDiv) return;
        $(legendDiv).empty();
        $(legendDiv).append(params[sym].cdbLegend.render().el);
    }
    
    var disableEvent = function(div, event) {
        $(div).bind(event, function(e) {
            e.stopPropagation();
        });
    }

    var createSwitcher = function(map, sublayer, withLegend, callback) {    
        var switcher = L.control({position: "bottomright"});
        switcher.onAdd = function(map) {
            var combolegend = L.DomUtil.create( "div", "combolegend");
            //prevent mousewheel to zoom on map
            disableEvent(combolegend, 'mousewheel DOMMouseScroll MozMousePixelScroll');
            
            var combo = L.DomUtil.create( "div", "cssSelector", combolegend);
            var sel =  L.DomUtil.create( "select", "form-control dropup", combo );
            var activeGroup = "";
            var activeGroupObject = null;
            $.each(params, function(key, value) {
                if (value.group != activeGroup) {
                    var optgroup =  L.DomUtil.create( "optgroup", "", sel );
                    $(optgroup).attr("Label", value.group);
                    activeGroup = value.group;
                    activeGroupObject = optgroup;
                }
                //append to optgroup or to select?
                var parent = activeGroupObject ? activeGroupObject : sel;
                var option =  L.DomUtil.create( "option", "", parent );
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
                sublayer.setCartoCSS(params[this.value].cartoCSS);
                callback(this.value, params[this.value]);
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
       createSwitcher: function(map, sublayer, withLegend, callback) {
       		return createSwitcher(map, sublayer, withLegend, callback);
       },
       getActiveParam: function() {
       		return params[activeParam];
       },
       setActiveParam: function(value) {
            activeParam = value;
        },
        getActiveParamName: function() {
            return activeParam;
        },
        getAllParamNames: function() {
            return Object.keys(params);
        }
	};
	
});