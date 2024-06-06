import { default as jsonld } from "jsonld";

// deno run -A jsonld.ts

const doc = {
  "http://schema.org/name": "Manu Sporny",
  "http://schema.org/url": { "@id": "http://manu.sporny.org/" },
  "http://schema.org/image": {
    "@id": "http://manu.sporny.org/images/manu.png",
  },
};

const context = {
  "name": "http://schema.org/name",
  "homepage": { "@id": "http://schema.org/url", "@type": "@id" },
  "image": { "@id": "http://schema.org/image", "@type": "@id" },
};

// TODO: Figure out how to associate context with item type. Create a context item type.

// compact a document according to a particular context
const compacted = await jsonld.compact(doc, context);
console.log("compacted");
console.log(JSON.stringify(compacted, null, 2));

// expand a document, removing its context
const expanded = await jsonld.expand(compacted);
console.log("expanded");
console.log(JSON.stringify(expanded, null, 2));

// flatten a document
const flattened = await jsonld.flatten(doc);
console.log("flattened");
console.log(JSON.stringify(flattened, null, 2));

// Difference between json-ld and itemized database:
// - Itemized database properties must be either repeatable or not repeatable.
// - JSON-LD properties can be either repeatable or not repeatable.
// - An Itemized database property will always be the same type.

// frame a document
const frame = {
  "@context": context,
  "name": "Manu Sporny",
};
const framed = await jsonld.frame(doc, frame);
console.log("framed");
console.log(JSON.stringify(framed, null, 2));

// canonize (normalize) a document using the RDF Dataset Canonicalization Algorithm
// (URDNA2015):
const canonized = await jsonld.canonize(doc, {
  algorithm: "URDNA2015",
  format: "application/n-quads",
});
console.log("canonized");
console.log(canonized);

// serialize a document to N-Quads (RDF)
const nquads = await jsonld.toRDF(doc, { format: "application/n-quads" });
console.log("toRDF");
console.log(nquads);

// deserialize N-Quads (RDF) to JSON-LD
const doc2 = await jsonld.fromRDF(nquads, { format: "application/n-quads" });
console.log("fromRDF");
console.log(doc2);
