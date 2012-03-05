var esdata;
var w = 30;       // bar width
var h = 500;      // bar height

var year_min = 0;
var year_max = 2000;
var year_size = 50;

var domain_max = 0; //max value data
var domain_min = 0; // min value data

var data = [];



function createSVG() {
    var chart = d3.select("body").append("svg")
        .attr("class", "chart")
        .attr("width", w * esdata.data.length - 1)
        .attr("height", h + 60);
}

function updateHist() {
    var chart = d3.select("body").select("svg")
        var data =esdata.data;
    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, w]);

    var y = d3.scale.linear()
        .domain([0, esdata.domain_max])
        .rangeRound([0, h - 30]);

    var hist = chart.selectAll("rect")
        .data(data);

    hist.enter().append("rect")
        .attr("x", function(d, i) { return x(i) - 1; })
        .attr("y", function(d) { return h - y(d.count) - .5; })
        .attr("width", w)
        .attr("height", function(d) { return y(d.count); });

    var texts = chart.selectAll(".label")
        .data(data);
    texts.enter().append('text')
        .attr("class", "label")
        .attr("x", function(d, i) { return x(i) - 1 + w / 2; })
        .attr("y", function(d) { return h - y(d.count) - .5 - 10; })
        .attr("width", w)
        .attr("color", "#FFF")
        .attr("text-anchor", "middle")
        .attr("height", function(d) { return y(d.count); })
        .text(function(d) { if (d.count > 0) { return d.count;} return ''; });

    var years = chart.selectAll(".year")
        .data(data);
    years.enter().append('text')
        .attr("class", "year")
        .attr("x", function(d, i) { return x(i) - 1 + w / 2; })
        .attr("y", function(d) { return h + 10; })
        .attr("width", w)
        .attr("text-anchor", "middle")
        .attr("height", function(d) { return 20; })
        .text(function(d) { return d.year; });

    hist.transition()
        .duration(500)
        .attr("y", function(d) { return h - y(d.count) - .5; })
        .attr("height", function(d) { return y(d.count); });

    texts.transition()
        .attr("y", function(d) { return h - y(d.count) - .5 - 10; })
        .attr("height", function(d) { return y(d.count); })
        .text(function(d) { if (d.count > 0) { return d.count;} return ''; });

    hist.exit()
        .remove();
    texts.exit()
        .remove();

}

var load_data = function(search) {
    $.ajax({   url: '/es/artdb/work/_search?pretty=true'
        , type: 'POST'
        , data : '{ "query" : { "query_string" : {"query" : "' + search + '"} },     "facets" : { "size": 10000, "tags" : { "terms" : {"field" : "creation.date", "size": 10000} } } }'
        , dataType : 'json'
        , processData: false
        , success: function(json, statusText, xhr) {
            return display_chart(json);
        }
    , error: function(xhr, message, error) {
        console.error("Error while loading data from ElasticSearch", message);
        throw(error);
    }
    });

    var display_chart = function(json) {
        esdata.mapData(json);
        updateHist();
    };

};

$( function() { 
    esdata = new ESData
    createSVG();
    $('#search').keyup(function() {
        if ($(this).val() != '') {
            load_data($(this).val());
        }
    });
    load_data($('#search').val());
});
