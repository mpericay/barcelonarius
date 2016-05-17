/**
 * @author Martí Pericay <marti@pericay.com>
 */


define(['chartjs'], function() {
    var create = function(div, data) {
        var canvas = document.createElement('canvas');
        $(div).append($(canvas));

        var myChart = new Chart($(canvas), {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3]
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