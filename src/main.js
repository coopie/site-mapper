var crawler = require('./crawler');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var args = process.argv;

if (args.length <= 2) {
    console.error('Please include a URI to scrape');
}

var pathToWriteTo = args[3] || 'site-map.json';

// check url is main page n stuff
var start = new Date();
crawler.crawl(args[2])
.then(function(map) {
    var finish = new Date();
    console.log('SUCCESS!');
    console.log('Found ', Object.keys(map).length, ' different pages, and took ', finish - start, 'ms');
    console.log('Writing map to: ', pathToWriteTo);
    fs.writeFile(pathToWriteTo, JSON.stringify(map, undefined, 4), function(error) {
        if (error) {
            console.error(error, error.stack);
        }
        console.log('Finished writing');
        process.exit();
    });
}).catch(function(error) {
    console.log('ERROR: ', error.message, '\n', error.stack);
});
