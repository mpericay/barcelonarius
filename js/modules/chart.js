/**
 * @author Martí Pericay <marti@pericay.com>
 */


define(['chartjs'], function() {
    var getArray = function(data, property) {
        var simpleArray = data.map(function(measure) {
            if (measure.hasOwnProperty(property)) {
                return measure[property];
            }
        });
        return simpleArray;
    };
    
    var create = function(div, data, options) {
        var canvas = document.createElement('canvas');
        if(data.length == 1) {
            $(div).html("Només hi ha un valor: " + data[0].param + " l'any " + data[0].year);
            return;
        }
        $(div).html($(canvas));
        
        var years = getArray(data, 'year');
        var values = getArray(data, 'param');

        var myChart = new Chart($(canvas), {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: options.name,
                    fill: false,
                    pointBorderColor: "#2e6da4",
                    pointBackgroundColor: "#008080",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "#008080",
                    pointHoverBorderColor: "#f90",
                    pointHoverBorderWidth: 2,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: values
                }]
            },
            options: {
                showLines: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
                legend: {
                    //display: false
                }
            }
        });
        
        if(options.maxvalue) myChart.options.scales.yAxes[0].ticks.max = options.maxvalue;
    };
    
    return {
       create: function(div, data, options) {
       		return create(div, data, options);
       }
	};
    
});