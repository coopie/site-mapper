var Promise = require('bluebird');
var request = require('request');
var htmlparser2 = require('htmlparser2');
var domInspector = require('./dom-inspector');
var url = require('url');

var handler = new htmlparser2.DefaultHandler();
var parser = new htmlparser2.Parser(handler, {decodeEntries: true});

function crawl(website) {
    var href = url.parse(website).href;

    var siteMap = {
        '/': {}
    };

    return crawlPage('/')
    .then(function() {
        return siteMap;
    });

    function crawlPage(pageUrl) {
        console.log('crawling ', pageUrl);
        var path = url.parse(pageUrl).path;
        return getData(linkify(pageUrl))
        .then(function(data) {
            parser.parseComplete(data.toString());
            var pageInfo = domInspector.inspect(handler.dom);
            siteMap[path] = pageInfo;

            var links = pageInfo.links;
            if (links) {
                links = links.map(removeTrailingSlash);

                var internalLinks = links.filter(fromDomain).map(addLeadingSlash);
                console.log('finished ', pageUrl);
                return Promise.all(internalLinks.map(function(link) {
                    link = url.parse(link).path || '/';

                    if (siteMap[link]) {
                        return Promise.resolve();
                    } else {
                        siteMap[link] = {};
                        return crawlPage(linkify(link));
                    }
                }));
            }

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
    }).timeout(20000)
    .catch(function(error) {
        return '';
    });
}

// Taken from: http://stackoverflow.com/questions/6680825/return-string-without-trailing-slash
function removeTrailingSlash(str) {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

function addLeadingSlash(str) {
    if (str[0] !== '/') {
        return '/' + str;
    }
    return str;
}

module.exports = {
    crawl: crawl
};
