var Promise = require('bluebird');
var request = require('request');
// var request = Promise.promisify(request);
var http = require('http');

function crawl(url) {
    // http.get(url, function(response) {
    //
    //     response.on('data', function(data) {
    //         console.log(data.toString());
    //     });
    // });
    return getData(url);
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
