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

type PropertyOf<
  TProperty extends ItemProperty<StringOnly<keyof TTypeMap>>,
  TTypeMap extends AnyRecord,
> = TProperty["type"] extends ItemID<string> ? ItemID<string>
  : (TProperty["type"] extends keyof TTypeMap ? TTypeMap[TProperty["type"]]
    : never);

type AnyRecord = Record<string, any>;

function idOf<T extends string>(schema: ItemSchema<T>): ItemID<T> {
  return { "@id": schema.id };
}

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
  | ItemID<T>;

export interface ItemID<T extends string> {
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

  interface TypeMap extends Primitives {
    "https://schema.example.com/Species": ItemOf<typeof speciesSchema, TypeMap>;
    "https://schema.example.com/Dog": ItemOf<typeof dogSchema, TypeMap>;
  }

  const speciesSchema = {
    id: "https://schema.example.com/Species",
    properties: {
      classification: { type: "https://schema.org/Text" },
      lifespan: { type: "https://schema.org/Number" },
      habitat: { type: "https://schema.org/Text" },
    },
  } as const satisfies ItemSchema<keyof TypeMap>;

  type Species = TypeMap["https://schema.example.com/Species"];

  const species: Species = {
    classification: "Mammal",
    lifespan: 10,
    habitat: "Land",
  };
  console.log(species);

  const dogSchema = {
    id: "https://schema.example.com/Dog",
    properties: {
      name: { type: "https://schema.org/Text" },
      age: { type: "https://schema.org/Number" },
      species: { type: idOf(speciesSchema) },
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
