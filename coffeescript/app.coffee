class ESData
  data: []
  domain_max: 0
  domain_min: 0
  year_min: 0
  year_max: 2000
  year_size: 50

  constructor: ()->
    @init

  init: ()->
    @domain_min = 0
    @domain_max =0
    @data = []
    @data.push {"year": i, "count": 0} for i in [@year_min..@year_max]

  mapData: (esjson)->
    @init()
    console.log esjson
    @took = esjson.took
    @hits = esjson.hits.total
    console.log "#{@hits} hits took #{@took} ms"
    data_input = esjson.facets.tags.terms
    for input in data_input
      for data in @data
        input_date = parseInt(input.term)
        range_date = parseInt(data.year)
        if (input_date < (range_date  + @year_size)) && (input_date >= range_date)
          data.count += input.count
          @domain_max = data.count if data.count > @domain_max
