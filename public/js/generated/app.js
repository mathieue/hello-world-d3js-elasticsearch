var ESData;

ESData = (function() {

  ESData.prototype.data = [];

  ESData.prototype.domain_max = 0;

  ESData.prototype.domain_min = 0;

  ESData.prototype.year_min = 0;

  ESData.prototype.year_max = 2000;

  ESData.prototype.year_size = 50;

  function ESData() {
    this.init;
  }

  ESData.prototype.init = function() {
    var i, _ref, _ref2, _ref3, _results;
    this.domain_min = 0;
    this.domain_max = 0;
    this.data = [];
    _results = [];
    for (i = _ref = this.year_min, _ref2 = this.year_max, _ref3 = this.year_size; _ref <= _ref2 ? i <= _ref2 : i >= _ref2; i += _ref3) {
      _results.push(this.data.push({
        "year": i,
        "count": 0
      }));
    }
    return _results;
  };

  ESData.prototype.mapData = function(esjson) {
    var data, data_input, input, input_date, range_date, _i, _j, _len, _len2, _ref;
    this.init();
    console.log(esjson);
    this.took = esjson.took;
    this.hits = esjson.hits.total;
    console.log("" + this.hits + " hits took " + this.took + " ms");
    data_input = esjson.facets.tags.terms;
    for (_i = 0, _len = data_input.length; _i < _len; _i++) {
      input = data_input[_i];
      _ref = this.data;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        data = _ref[_j];
        input_date = parseInt(input.term);
        range_date = parseInt(data.year);
        if ((input_date < (range_date + this.year_size)) && (input_date >= range_date)) {
          data.count += input.count;
          if (data.count > this.domain_max) this.domain_max = data.count;
        }
      }
    }
    return console.log(this.data);
  };

  return ESData;

})();
