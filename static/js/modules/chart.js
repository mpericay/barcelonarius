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
    
    var create = function(div, data) {
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
                    label: 'Ecostrimed',
                    data: values
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    };
    
    return {
       create: function(div, data) {
       		return create(div, data);
       }
	};
    
});