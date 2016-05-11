/**
 * @author Martí Pericay <marti@pericay.com>
 */


define(['slider'], function() {
	
	var moments = [
		{
			year: '1979',
			dry: false
		},
		{
			year: '1980-1989',
			yearArray: [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989], 
			dry: false
		},
		{
			year: '1990',
			dry: false
		},
		{
			year: '1991-1994', 
			yearArray: [1991, 1992, 1993, 1994], 
			dry: false
		},
		{
			year: '1995',
			dry: false
		},
		{
			year: '1996',
			dry: false
		},
		{
			year: '1997',
			dry: false
		},
		{
			year: '1998',
			dry: false
		},
		{
			year: '1999',
			dry: false
		},
		{
			year: '2000',
			dry: false
		},
		{
			year: '2001',
			dry: false
		},
		{
			year: '2002',
			dry: false
		},
		{
			year: '2003',
			dry: true
		},
		{
			year: '2004',
			dry: false
		},
		{
			year: '2005',
			dry: false
		},
		{
			year: '2006',
			dry: true
		},
		{
			year: '2007',
			dry: false
		},
		{
			year: '2008',
			dry: false
		},
		{
			year: '2009',
			dry: false
		},
		{
			year: '2010',
			dry: false
		},
		{
			year: '2011',
			dry: true
		},
		{
			year: '2012',
			dry: false
		},
		{
			year: '2013',
			dry: true
		},
		{
			year: '2014',
			dry: false
		},
		{
			year: '2015',
			dry: false
		}
	];
	
	var tickArray = [0, 6, 12, 18, 24];
	
	var tickPositions = [];
	var tickLabels = [];
	tickArray.forEach(function(val) {
		tickLabels.push(moments[val].year);
		tickPositions.push(val*100/tickArray[tickArray.length - 1]);
	});
	
	var isDry = function(val) {
        return moments[val].dry;
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