var _ = require('lodash');

var inspectors = [
    inspectLinks,
    inspectImages
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
        domNode.attribs) {
        var image = domNode.attribs;
        if (pageAttributes.images) {
            pageAttributes.images.push(image);
        } else {
            pageAttributes.images = [image];
        }
    }
}

module.exports = {
    inspect: inspect
};
