/**
 * @author Martí Pericay <marti@pericay.com>
 * @author Pau Fortuño <pfortuno@ub.edu>
 */
define(['cartodb'], function() {
    "use strict";
    
    var ecostLegend = new cdb.geo.ui.Legend.Custom({
        title: "Calidad ecológica",
        data: [
          { name: "Muy buena", value: "#5CA2D1" },
          { name: "Buena", value: "#33a02c" },
          { name: "Moderada", value: "#FFCC00" },
          { name: "Mala", value: "#FF6600" },
          { name: "Pésima", value: "#B81609" },
          { name: "El agua no fluye", value: "#9b6f51" },
          { name: "No evaluada", value: "#b3b3b3" }
        ]
    });
    
    var hidroLegend = new cdb.geo.ui.Legend.Category({
        title: "Calidad hidrológica (a partir 2017-18)",
        data: [
          { name: "Buena", value: "url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/ub/assets/20180611084810v_good.png)" },
          { name: "Alterada", value: "url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/ub/assets/20180611084824x_moderate.png)" },
          { name: "Pésima", value: "url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/ub/assets/20180611084836x_bad.png)" },
          { name: "No evaluada", value: "#b3b3b3" }
        ]
    });
    
    
    var params = {
        'water_quality_points_text': {
            cdbLegend: hidroLegend,
            cartoCSS: '#riunet { marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 10; marker-allow-overlap: true; }  #riunet[water_quality_points_text="Buena"] { marker-file: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/ub/assets/20180611084810v_good.png); } #riunet[water_quality_points_text="Mala"] { marker-file: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/ub/assets/20180611084824x_moderate.png); } #riunet[water_quality_points_text="NA"] { marker-fill: #b3b3b3; } #riunet[water_quality_points_text="Pésima"] { marker-file: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/ub/assets/20180611084836x_bad.png); }',
            name: "Calidad hidrológica"
        },
        'eco_points_text': {
            cdbLegend: ecostLegend,
            cartoCSS: "#riunet { marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 10; marker-allow-overlap: true;}#riunet[eco_points_text=''] { marker-fill: #b3b3b3;}#riunet[eco_points_text='Bueno'] { marker-fill: #229A00;}#riunet[eco_points_text='Excelente'] { marker-fill: #3E7BB6;}#riunet[eco_points_text='Malo'] { marker-fill: #FF6600;}#riunet[eco_points_text='Moderado'] { marker-fill: #FFCC00;}#riunet[eco_points_text='Muy Bueno'] { marker-fill: #3E7BB6;}#riunet[eco_points_text='Muy bueno'] { marker-fill: #3E7BB6;}#riunet[eco_points_text='NA'] { marker-fill: #b3b3b3;}#riunet[eco_points_text='Pésimo'] { marker-fill: #B81609;}#riunet[eco_points_text='el agua no fluye'] { marker-fill: #9b6f51;}",
            name: "Calidad ecológica"
        }        
    };
    
    return {
       getParams: function() {
       		return params;
       }
	};
    
});