/**
 * @author Martí Pericay <marti@pericay.com>
 */


define(['map', 'bootstrap', 'slider'], function() {
	
	var isEven = function(n) {
        n = Number(n);
        return n === 0 || !!(n && !(n%2));
      };
    
    var getTooltip = function(value) {
        if(isEven(value)) return "Estiu 2014";
        else return "Primavera 2014";
    };
    
    var slider = $("#slider").slider({
        formatter: function(value) {
            return getTooltip(value);
        },
        tooltip: 'always',
		max: 30,
		value: 30,
		step: 1,
		ticks: [0, 6, 12, 18, 24, 30],
		ticks_labels: ['1979', '2002', '2005', '2008', '2011', '2014'],
		ticks_snap_bounds: 0
	});
    
    slider.change(function() {
        if (isEven(this.value) && isEven(this.value/2)) $(".slider-handle").addClass("slider-handle-dry ");
		else $(".slider-handle").removeClass("slider-handle-dry ");
    });
	
});