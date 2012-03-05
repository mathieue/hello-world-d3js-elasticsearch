var esdata;
var w = 30;       // bar width
var h = 500;      // bar height

function createSVG() {
    var chart = d3.select("body").append("svg")
        .attr("class", "chart")
        .attr("width", w * 40 - 1)
        .attr("height", h + 160);

    chart.append("text")
        .attr("id", "maintext")
        .attr("y", 80);

    chart.append("text")
        .attr("id", "legend")
        .attr("y", 550)
        .text("Artworks by years");
}

function redraw(search) {
    var chart = d3.select("body").select("svg")
    var data = esdata.data;

    d3.select("#maintext")
        .text(search + " : " + esdata.hits + " hits fetched in " + esdata.took + " ms");

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

    hist.transition()
        .duration(500)
        .attr("y", function(d) { return h - y(d.count) - .5; })
        .attr("height", function(d) { return y(d.count); });

    hist.exit()
        .remove();

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

    texts.transition()
        .attr("y", function(d) { return h - y(d.count) - .5 - 10; })
        .attr("height", function(d) { return y(d.count); })
        .text(function(d) { if (d.count > 0) { return d.count;} return ''; });

    texts.exit()
        .remove();

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

}

var load_data = function(search) {
    $.ajax({   url: '/search'
        , type: 'POST'
        , data : '{ "query" : { "query_string" : {"query" : "' + search + '"} },     "facets" : {  "tags" : { "terms" : {"field" : "creation.date", "size": 100000000} },"continent" : { "terms" : {"field" : "creation.continent", "size": 100000000} } } }'
        , dataType : 'json'
        , processData: false
        , success: function(json, statusText, xhr) {
            return display_chart(json, search);
        }
    , error: function(xhr, message, error) {
        console.error("Error while loading data from ElasticSearch", message);
        throw(error);
    }
    });

    var display_chart = function(json, search) {
        esdata.mapData(json);
        redraw(search);
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
