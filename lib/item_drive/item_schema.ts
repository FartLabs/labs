const speciesSchema = {
  id: "https://example.com/Species",
  properties: {
    name: { type: "string" },
    classification: { type: "string" },
    lifespan: { type: "number" },
    habitat: { type: "string" },
  },
} as const satisfies ItemSchema;

interface TypeMap {
  "https://schema.org/Text": string;
  "https://schema.org/DateTime": string;
  "https://schema.org/Boolean": boolean;
  "https://schema.org/Date": string;
  "https://schema.org/Time": string;
  "https://schema.org/Number": number;
}

type ItemOf<T extends ItemSchema, U extends Record<string, any>> = {
  [K in keyof T["properties"]]: T["properties"][K] extends { type: IDType }
    ? IDType
    : T["properties"][K] extends { type: string } ? U[K]
    : never;
};

// Text
// DateTime
// Boolean
// Date
// Time
// Number

type ItemID<T extends ItemSchema> = T["id"];

const dogSchema = {
  id: "https://example.com/Dog",
  properties: {
    name: { type: "https://schema.org/Text" },
    age: { type: "https://schema.org/Number" },
    // breed: { type: "https://example.com/Breed" },
    species: { type: { id: speciesSchema.id } },
  },
} as const satisfies ItemSchema;

export interface ItemSchema {
  id: string;
  properties: {
    [propertyName: string]: ItemProperty;
  };
}

export interface ItemProperty {
  repeatable?: boolean;
  type: ItemType;
}

export type ItemType = string | IDType;

export interface IDType {
  id: string;
}
