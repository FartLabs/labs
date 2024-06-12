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

interface Struct {
  [propertyName: string]: StructProperty;
}

interface StructProperty {
  "@id": string;
  // Distinguish named and primitive types.
  dataType: string;
  description?: string;
  repeatable?: boolean;
}

const webringStruct: Struct = {
  name: {
    "@id": "https://0xd14.id/#Webring/name",
    dataType: PROPERTY_TEXT,
    description: "The name of the webring.",
  },
  version: {
    "@id": "https://0xd14.id/#Webring/version",
    dataType: PROPERTY_NUMBER,
    description: "The version of the webring.",
  },
  ring: {
    "@id": "https://0xd14.id/#Webring/ring",
    dataType: "Webring/Ring",
    description: "The ring of the webring.",
    repeatable: true,
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
