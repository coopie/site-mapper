var crawler = require('./crawler');

if (process.argv <= 2) {
    console.error('Please include a URI to scrape');
}

// check url is main page n stuff
var start = new Date();
crawler.crawl(process.argv[2])
.then(function(map) {
    var finish = new Date();
    console.log('SUCCESS!: ', JSON.stringify(map, undefined, 2));
    console.log('found ', Object.keys(map).length, ' different pages, and took ', finish - start, 'ms');
    process.exit();
}).catch(function(error) {
    console.log('ERROR: ', error.message, '\n', error.stack);
});
