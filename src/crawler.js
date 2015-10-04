var Promise = require('bluebird');
var http = require('http');
var htmlparser2 = require('htmlparser2');

var handler = new htmlparser2.DefaultHandler(function(error, dom) {
    console.log('dom : ', dom);
});
var parser = new htmlparser2.Parser(handler, {decodeEntries: true});

function crawl(url) {

    return getData(url)
    .then(function(data) {
        return parser.parseComplete(data.toString());
    });
}

function getData(url) {
    return new Promise(function(fulfill, reject) {
        http.get(url, function(response) {

            response.on('data', function(data) {
                fulfill(data);
            });
        })
        .on('error', function(error) {
            reject(error);
        });
    });
}

module.exports = {
    crawl: crawl
};
