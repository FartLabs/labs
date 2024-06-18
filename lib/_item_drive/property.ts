const SCHEMA_ORG = "https://schema.org/";
const PROPERTY_TEXT = `${SCHEMA_ORG}Text`;
const PROPERTY_DATE_TIME = `${SCHEMA_ORG}DateTime`;
const PROPERTY_BOOLEAN = `${SCHEMA_ORG}Boolean`;
const PROPERTY_DATE = `${SCHEMA_ORG}Date`;
const PROPERTY_TIME = `${SCHEMA_ORG}Time`;
const PROPERTY_NUMBER = `${SCHEMA_ORG}Number`;

export type StructTypeOf<
  T extends Struct,
  TProperties extends { [propertyName: string]: unknown },
> = {
  [propertyName in keyof T]: PropertyTypeOf<T[propertyName], TProperties>;
};

// Provide map of property names to their external types for non primitive types.
export type PropertyTypeOf<
  T extends StructProperty,
  TProperties extends { [propertyName: string]: unknown },
> = T["repeatable"] extends true
  ? RuntimePropertyTypeOf<T["dataType"], TProperties>[]
  : RuntimePropertyTypeOf<T["dataType"], TProperties>;

export type RuntimePropertyTypeOf<
  TProperty extends string,
  TProperties extends { [propertyName: string]: unknown },
> = TProperties[TProperty];

export interface PrimitivePropertyTypeMap {
  [PROPERTY_TEXT]: string;
  [PROPERTY_DATE_TIME]: string;
  [PROPERTY_BOOLEAN]: boolean;
  [PROPERTY_DATE]: string;
  [PROPERTY_TIME]: string;
  [PROPERTY_NUMBER]: number;
}

/**
 * Struct is a data structure that semantically describes a type.
 */
interface Struct {
  "@id": string;
  properties: {
    [propertyName: string]: StructProperty;
  };
}

interface StructProperty {
  /**
   * `@id` refers to the type of the property.
   */
  "@id": string;
  // Distinguish named and primitive types.
  repeatable?: boolean;
}

const ID_WEBRING = "https://0xd14.id/#Webring";
const ID_WEBRING_RING = "https://0xd14.id/#Webring/Ring";
const ID_PROPERTY_WEBRING_NAME = "https://0xd14.id/#Webring/name";
const ID_PROPERTY_WEBRING_VERSION = "https://0xd14.id/#Webring/version";
const ID_PROPERTY_WEBRING_RING = "https://0xd14.id/#Webring/ring";
const ID_PROPERTY_WEBRING_RING_LINK = "https://0xd14.id/#Webring/Ring/link";
const ID_PROPERTY_WEBRING_RING_NAME = "https://0xd14.id/#Webring/Ring/name";

// TODO: Make this as ergonomic as possible.
const ringStruct: Struct = {
  "@id": ID_WEBRING_RING,
  properties: {
    link: { "@id": ID_PROPERTY_WEBRING_RING_LINK },
    name: { "@id": ID_PROPERTY_WEBRING_RING_NAME },
  },
};

const webringStruct: Struct = {
  "@id": ID_WEBRING,
  properties: {
    name: { "@id": ID_PROPERTY_WEBRING_NAME },
    version: { "@id": ID_PROPERTY_WEBRING_VERSION },
    ring: { "@id": ID_PROPERTY_WEBRING_RING, repeatable: true },
  },
};

// const webringClass = {
//   "@id": "https://0xd14.id/#Webring",
//   "@type": "Class",
//   description: "A webring of websites, follows libdb.so/libwebring.",
// } as const satisfies Class;
//
// const webringProperty = {
//   "@id": "https://0xd14.id/#webring",
//   "@type": "Property",
//   domainIncludes: { "@id": webringClass["@id"] },
// } as const satisfies Property;

// TODO: Infer runtime type of property by dataType and repeatable.

// https://0xd14.id/
const exampleNodes = [
  {
    "@id": "https://0xd14.id/#webring",
    "@type": "rdf:Property",
    "rdfs:comment": "The webring(s) that the thing is part of.",
    "rdfs:label": "webring",
    "rangeIncludes": "libdb:Webring",
  },
  {
    "@id": "https://0xd14.id/#Webring",
    "@type": "rdfs:Class",
    "rdfs:comment": "A webring of websites, follows libdb.so/libwebring.",
    "rdfs:label": "Webring",
  },
  {
    "@id": "https://0xd14.id/#Webring/name",
    "@type": "rdf:Property",
    "rdfs:comment": "The name of the webring.",
    "rdfs:label": "name",
    "rangeIncludes": "Text",
  },
  {
    "@id": "https://0xd14.id/#Webring/version",
    "@type": "rdf:Property",
    "rdfs:comment": "The version of the webring.",
    "rdfs:label": "version",
    "rangeIncludes": "Number",
  },
  {
    "@id": "https://0xd14.id/#Webring/ring",
    "@type": "rdf:Property",
    "rdfs:comment": "The ring of the webring.",
    "rdfs:label": "ring",
    "rangeIncludes": "libdb:Webring/Ring",
  },
  {
    "@id": "https://0xd14.id/#Webring/Ring",
    "@type": "rdfs:Class",
    "rdfs:comment": "A ring in a webring.",
    "rdfs:label": "Ring",
  },
  {
    "@id": "https://0xd14.id/#Webring/Ring/link",
    "@type": "rdf:Property",
    "rdfs:comment": "The link to the ring.",
    "rdfs:label": "link",
    "rangeIncludes": "URL",
  },
  {
    "@id": "https://0xd14.id/#Webring/Ring/name",
    "@type": "rdf:Property",
    "rdfs:comment": "The name of the ring.",
    "rdfs:label": "name",
    "rangeIncludes": "Text",
  },
];
