var _ = require('lodash');

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
    extractLinksFromDom: extractLinksFromDom
};
