var crawler = require('./crawler');

crawler.crawl('http://www.samcoope.com/')
.then(function(map) {
    console.log('SUCCESS!!!: ', map);
}).catch(function(error) {
    console.log('ERROR: ', error);
});
