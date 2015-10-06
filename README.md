# site-mapper
A site-mapper written in Node. The mapper takes a url and returns a JSON file representing the assets of each page. An example output is in site-map.json.

Currently the siteMap only extracts:

* links
* scripts
* images
* text

But more assets can be added easily in dom-inspector.js

## Running the site-mapper

In order to run the site mapper, first install the dependencies:

`npm install`

Then run:

`npm start <url> [pathname]`

where `url` is the complete url for a website, eg `http://www.samcoope.com/`
and pathname (optional) is the path to the file where the site-map will be written to.


## Design

#### crawler.js
Responsible for finding scraping the website domain

#### dom-inspector.js
Responsible for extracting the relevant information from the html parse tree.


## Rationale

The design follows a functional programming principles mostly. The crawler uses a recursive algorithm to:

1. Send a request to get the data for a url.
*  Parse the html brought back.
*  Recursively reduce/fold the html parse tree with inspection methods for each type of resource the site-mapper is looking for, add this information to the site-map.
*  Extract the links from the page to internal web pages of the domain.
*  Recurse for each internal link on the page.

This really plays to Node.js's strengths as an asynchronous runtime, as there is no busy waiting, no significant increase of memory from heavyweight thread production, and most importantly no requirement to use any parallelism which could result in race conditions.

Another possible way of scraping the html of each page would to build a DOM and jquery each of the different aspects of the page that I was looking for. However, not only did this feel a little bit like cheating in my eyes, it also is very ***very*** slow compared to using the lighting quick `htmlparser2` node has to offer.

## Hard/Interesting Problems

An interesting problem to solve was how to increase the amount of different criteria to search in the html parse tree without ending up with a very large function.

The way I solved this was buy making an array of functions (hooray first class funcitons!) which were applied to each node in the html parse tree.

Getting pure text (i.e. text from the webpage which the user should read) is a very challenging problem to solve. Lucking, libraries like jquery have already solved this with things with a simple `$('body').text()`.

However, my implantation of inspecting each DOM node by itself does not allow for high level implantations like this, and not slow it down by a significant amount.
