/**
 * @author Martí Pericay <marti@pericay.com>
 */


define(['slider'], function() {
	
	var moments = [
		{
			year: '2015'
		},
		{
			year: '2016'
		},
		{
			year: '2017'
		},
		{
			year: '2018'
		}
	];
	
	var tickArray = [0, 1, 2, 3];
	
	var tickPositions = [];
	var tickLabels = [];
	tickArray.forEach(function(val) {
		tickLabels.push(moments[val].year);
		tickPositions.push(val*100/tickArray[tickArray.length - 1]);
	});
	
	var isDry = function(val) {
        //return moments[val].dry;
		return false;
    };
    
    var getTooltip = function(value) {
		var message = moments[value].year;
		if(isDry(value)) {
			$(".slider-handle").addClass("slider-handle-dry ");
			message += " (sec)";
		}
		else $(".slider-handle").removeClass("slider-handle-dry ");			
		return message;		
    };
	
	var create = function(map, callback) {
		
		var slider = $("#slider").slider({
			formatter: function(value) {
				return getTooltip(value);
			},
			tooltip: 'always',
			min: 0,
			max: moments.length - 1,
			value: moments.length - 1,
			//value: moments.length - 1,
			step: 1,
			ticks: tickArray,
			ticks_labels: tickLabels,
			ticks_positions: tickPositions,
			ticks_snap_bounds: 0
		});
		
		slider.change(function() {
			var years = moments[this.value].yearArray ? moments[this.value].yearArray : moments[this.value].year;
			callback(years);
		});
	};
	
	return {
       create: function(map, callback) {
       		return create(map, callback);
       }
	};
	
});