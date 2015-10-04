var Promise = require('bluebird');
var request = require('request');
var htmlparser2 = require('htmlparser2');
var domInspector = require('./dom-inspector');
var url = require('url');

var handler = new htmlparser2.DefaultHandler();
var parser = new htmlparser2.Parser(handler, {decodeEntries: true});

function crawl(website) {
    var href = url.parse(website).href;

    var graph = {
        '/': []
    };

    return crawlPage('/')
    .then(function() {
        return graph;
    });

    function crawlPage(pageUrl) {
        console.log('crawling ', pageUrl);
        var path = url.parse(pageUrl).path;
        return getData(linkify(pageUrl))
        .then(function(data) {

            parser.parseComplete(data.toString());
            var links = domInspector.extractLinksFromDom(handler.dom).filter(fromDomain);
            graph[path] = links;

            console.log('finished ', pageUrl);
            return Promise.all(links.map(function(link) {
                link = url.parse(link).path || '/';

                if (graph[link]) {
                    return Promise.resolve();
                } else {
                    graph[link] = [];
                    return crawlPage(linkify(link));
                }
            }));

        });
    }

    function linkify(pageUrl) {
        if (url.parse(pageUrl).hostname) {
            return pageUrl;
        } else {
            if (pageUrl[0] === '/') {
                pageUrl = pageUrl.slice(1);
            }
            return href + pageUrl;
        }
    }

    function fromDomain(pageUrl) {
        // return pageUrl[0] === '/' ||
        //     url.parse(pageUrl).href === href;
        return pageUrl[0] === '/' || !url.parse(pageUrl).hostname;
    }
}

function getData(pageUrl) {
    return new Promise(function(fulfill, reject) {
        request.get(pageUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                fulfill(body);
            } else {
                fulfill('');
            }
        });
    }).timeout(5000)
    .catch(function(error) {
        return '';
    });
}

module.exports = {
    crawl: crawl
};
