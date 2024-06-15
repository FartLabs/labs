import { Item } from "labs/items.ts";

const speciesSchema = {
  id: "https://example.com/Species",
  properties: {
    classification: { type: "https://schema.org/Text" },
    lifespan: { type: "https://schema.org/Number" },
    habitat: { type: "https://schema.org/Text" },
  },
} as const satisfies ItemSchema<keyof TypeMap>;

interface TypeMap {
  "https://schema.org/Text": string;
  "https://schema.org/DateTime": string;
  "https://schema.org/Boolean": boolean;
  "https://schema.org/Date": string;
  "https://schema.org/Time": string;
  "https://schema.org/Number": number;
  "https://example.com/Dog": ItemOf<typeof dogSchema, TypeMap>;
}

type ItemOf<
  TItemSchema extends ItemSchema<keyof TTypeMap>,
  TTypeMap extends { [key: string]: any },
> = {
  [P in keyof TItemSchema["properties"]]:
    TTypeMap[TItemSchema["properties"][P]["type"]];
};

// Text
// DateTime
// Boolean
// Date
// Time
// Number

function ref<T extends string>(schema: ItemSchema<T>) {
  return { ref: schema.id as T };
}

const dogSchema = {
  id: "https://example.com/Dog",
  properties: {
    name: { type: "https://schema.org/Text" },
    age: { type: "https://schema.org/Number" },
    // breed: { type: "https://example.com/Breed" },
    species: { type: ref(speciesSchema) },
  },
} as const satisfies ItemSchema<keyof TypeMap>;

export interface ItemSchema<T extends string> {
  id: T;
  properties: {
    [propertyName: string]: ItemProperty<T>;
  };
}

export interface ItemProperty<T extends string> {
  repeatable?: boolean;
  type: ItemPropertyType<T>;
}

export type ItemPropertyType<T extends string> =
  | T
  | { ref: T };

// An ItemSchema could satisfy multiple schema.org types.
