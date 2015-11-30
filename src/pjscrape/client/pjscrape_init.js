var suiteConfig = {};

window.pjs = {
    // limited addSuite support
    addSuite: function(config) {
        config = _pjs$.extend(suiteConfig, config);
        // reassign jQuery if necessary
        if (!config.noConflict) {
            window.$ = window.jQuery = window._pjs$;
        }
        // prescrape
        if (config.preScrape) config.preScrape();
        // test scrapable
        var scrapable = config.scrapable ?
            function() {
                var test = !!config.scrapable();
                console.log('scrapable', test);
                return test;
            }
            : function() { return true };
        if (scrapable()) {
            // run scraper(s)
            arrify(config.scraper || config.scrapers)
                .forEach(function(scraper, i) {
                    if (isFunction(scraper)) {
                        // standard scraper
                        console.log('scraper ' + i, JSON.stringify(scraper()));
                    } else if (typeof scraper == 'string') {
                        // selector-only scraper
                        console.log('scraper ' + i, JSON.stringify(_pjs.getText(scraper)));
                    } else if (scraper.scraper) {
                        // XXX: async not supported yet
                    }
                });
        }
        // log moreUrls
        if (config.moreUrls) console.log('moreUrls', config.moreUrls());
    },
    addScraper: function(url, scraper) {
        this.addSuite({url:url, scraper:scraper})
    },
    config: function(opts) {
        _pjs$.extend(suiteConfig, opts);
    },
    define: function(obj) {
      var results = (function(jQuery) {
        return obj.scraper.call(this);
      })(window._pjs$);
      console.table(results);
    }
}
