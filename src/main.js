var crawler = require('./crawler');

crawler.crawl('https://www.npmjs.com/package/node-set')
.then(function(map) {
    console.log('SUCCESS!!!: ', map);
}).catch(function(error) {
    console.log('ERROR: ', error);
});
