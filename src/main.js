var crawler = require('./crawler');

if (process.argv <= 2) {
    console.error('Please include a URI to scrape');
}

// check url us main page n stuff

crawler.crawl(process.argv[2])
.then(function(map) {
    console.log('SUCCESS!: ', JSON.stringify(map, undefined, 2));
}).catch(function(error) {
    console.log('ERROR: ', error);
});
