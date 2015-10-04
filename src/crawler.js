var Promise = require('bluebird');
var request = require('request');
var htmlparser2 = require('htmlparser2');
var Set = require('node-set');
var _ = require('lodash');

var handler = new htmlparser2.DefaultHandler();
var parser = new htmlparser2.Parser(handler, {decodeEntries: true});

function crawl(url) {
    return getData(url)
    .then(function(data) {
        parser.parseComplete(data.toString());
        return extractLinksFromDom(handler.dom);
    });
}

function getData(url) {
    return new Promise(function(fulfill, reject) {
        request.get(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                fulfill(body);
            } else {
                reject(error);
            }
        });
    });
}

function extractLinksFromDom(dom) {
    return _.unique(extractLinksFromDomHelper(dom));

    function extractLinksFromDomHelper(dom) {
        return dom.reduce(function(links, domNode) {
            if (domNode.name && domNode.name === 'a' &&
                domNode.attribs && domNode.attribs.href) {
                links.push(domNode.attribs.href);
            }

            if (domNode.children) {
                links = links.concat(extractLinksFromDomHelper(domNode.children));
            }
            return links;
        }, []);
    }
}

module.exports = {
    crawl: crawl
};
