var _ = require('lodash');

// These are the methods which inpect dom-nodes to extract relevant information.
// To add functionality for videos, CSS etc, add the inspection methods here
var inspectors = [
    inspectLinks,
    inspectImages,
    inspectScript,
    inspectText
];

function inspect(dom) {
    var pageInfo = inspectHelper(dom, {});
    Object.keys(pageInfo).forEach(function(infoType) {
        pageInfo[infoType] = _.unique(pageInfo[infoType]);
    });
    return pageInfo;

    function inspectHelper(dom, pageAttributes) {
        return dom.reduce(function(pageAttributes, domNode) {
            inspectors.forEach(function(inspector) {
                inspector(pageAttributes, domNode);
            });

            if (domNode.children) {
                pageAttributes = inspectHelper(domNode.children, pageAttributes);
            }
            return pageAttributes;
        }, pageAttributes);
    }
}

function inspectLinks(pageAttributes, domNode) {
    if (domNode.name && domNode.name === 'a' &&
        domNode.attribs && domNode.attribs.href) {
        var href = domNode.attribs.href;
        if (pageAttributes.links) {
            pageAttributes.links.push(href);
        } else {
            pageAttributes.links = [href];
        }
    }
}

function inspectImages(pageAttributes, domNode) {
    if (domNode.name && domNode.name === 'img' &&
        domNode.attribs && !_.isEmpty(domNode.attribs)) {
        var image = domNode.attribs;
        if (pageAttributes.images) {
            pageAttributes.images.push(image);
        } else {
            pageAttributes.images = [image];
        }
    }
}

function inspectScript(pageAttributes, domNode) {
    if (domNode.type && domNode.type === 'script' &&
        domNode.attribs && !_.isEmpty(domNode.attribs)) {
        var script = domNode.attribs;
        if (pageAttributes.scripts) {
            pageAttributes.scripts.push(script);
        } else {
            pageAttributes.scripts = [script];
        }
    }
}

function inspectText(pageAttributes, domNode) {
    var textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
    if (domNode.type && domNode.type === 'text' &&
        domNode.parent && domNode.parent && _.contains(textTags, domNode.parent.name) &&
        domNode.data && domNode.data.match(/\S/)) {
        var text = domNode.data;
        if (pageAttributes.text) {
            pageAttributes.text.push(text);
        } else {
            pageAttributes.text = [text];
        }
    }
}

module.exports = {
    inspect: inspect
};
