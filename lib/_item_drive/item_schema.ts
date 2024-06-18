type StringOnly<T> = T extends string ? T : never;

type ItemOf<
  TItemSchema extends ItemSchema<StringOnly<keyof TTypeMap>>,
  TTypeMap extends AnyRecord,
> = {
  [P in keyof TItemSchema["properties"]]: PropertyOf<
    TItemSchema["properties"][P],
    TTypeMap
  >;
};

// TODO
type PropertyOf<
  TProperty extends ItemProperty<StringOnly<keyof TTypeMap>>,
  TTypeMap extends AnyRecord,
> = TProperty["repeatable"] extends true
  ? Array<PropertyOf<Omit<TProperty, "repeatable">, TTypeMap>>
  : TProperty["@type"] extends ItemID ? ItemID
  : (TProperty["@type"] extends keyof TTypeMap ? TTypeMap[TProperty["@type"]]
    : never);

type AnyRecord = Record<string, any>;

function idOf<T extends string>(schema: ItemSchema<T>): ItemID<T> {
  return { "@id": schema["@id"] };
}

// Default fact storage is located in the item drive.
export interface ItemSchema<T extends string> extends ItemID<T> {
  // attributes.
  properties: Record<string, ItemProperty<T, T>>;
}

// ItemPropertySchema is a schema for a property of an item.
export interface ItemProperty<TPrimitive extends string, TID extends string> {
  "@type": ItemPropertyType<TPrimitive>;
  "@id"?: TID; // ID of schema property.
  repeatable?: boolean;
}

// TODO: Add support for union types with arrays.
export type ItemPropertyType<T extends string> =
  | T
  | ItemID<T>;

export interface ItemID<T extends string = string> {
  "@id": T;
}

// An ItemSchema could satisfy multiple schema.org types.

if (import.meta.main) {
  interface Primitives {
    "https://schema.org/Text": string;
    "https://schema.org/DateTime": string;
    "https://schema.org/Boolean": boolean;
    "https://schema.org/Date": string;
    "https://schema.org/Time": string;
    "https://schema.org/Number": number;
  }

  // TODO
  interface Properties {
    "https://schema.org/name": { type: "https://schema.org/Text" };
    "https://schema.org/alumniOf": {
      repeatable: true;
      type: ItemID<"https://schema.org/Organization">;
    };
  }

  interface TypeMap extends Primitives {
    "https://schema.example.com/Species": ItemOf<typeof speciesSchema, TypeMap>;
    "https://schema.example.com/Dog": ItemOf<typeof dogSchema, TypeMap>;
  }

  const speciesSchema = {
    "@id": "https://schema.example.com/Species",
    properties: {
      classification: { "@type": "https://schema.org/Text" },
      lifespan: { "@type": "https://schema.org/Number" },
      habitat: { "@type": "https://schema.org/Text", repeatable: true },
    },
  } as const satisfies ItemSchema<keyof TypeMap>;

  type Species = TypeMap["https://schema.example.com/Species"];

  const species: Species = {
    classification: "Mammal",
    lifespan: 10,
    habitat: ["Land"],
  };
  console.log(species);

  const dogSchema = {
    "@id": "https://schema.example.com/Dog",
    properties: {
      // TODO: Reference properties instead of types.
      name: { "@type": "https://schema.org/Text" },
      age: { "@type": "https://schema.org/Number" },
      // species: { "@type": speciesSchema["@id"] },
      species: { "@type": idOf(speciesSchema) },
    },
  } as const satisfies ItemSchema<keyof TypeMap>;

  type Dog = TypeMap["https://schema.example.com/Dog"];

  const dog: Dog = {
    name: "Fido",
    age: 3,
    species: { "@id": "https://example.com/species/dog" },
  };
  console.log(dog);
}
