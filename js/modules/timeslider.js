/**
 * @author Martí Pericay <marti@pericay.com>
 */


define(['slider'], function() {
	
	var moments = [
		{
			year: '1979'
		},
		{
			year: '1980-1989',
			yearArray: [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989]
		},
		{
			year: '1990'
		},
		{
			year: '1991-1994', 
			yearArray: [1991, 1992, 1993, 1994]
		},
		{
			year: '1995'
		},
		{
			year: '1996'
		},
		{
			year: '1997'
		},
		{
			year: '1998'
		},
		{
			year: '1999'
		},
		{
			year: '2000'
		},
		{
			year: '2001'
		},
		{
			year: '2002'
		},
		{
			year: '2003'
		},
		{
			year: '2004'
		},
		{
			year: '2005'
		},
		{
			year: '2006'
		},
		{
			year: '2007'
		},
		{
			year: '2008'
		},
		{
			year: '2009'
		},
		{
			year: '2010'
		},
		{
			year: '2011'
		},
		{
			year: '2012'
		},
		{
			year: '2013'
		},
		{
			year: '2014'
		},
		{
			year: '2015'
		},
		{
			year: '2016'
		},
		{
			year: '2017'
		}
	];
	
	var tickArray = [0, 7, 13, 19, 26];
	
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
       },
	   getLastYear: function() {
			return parseInt(moments[moments.length-1].year);
	   }
	};
	
});