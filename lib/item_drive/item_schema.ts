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
> = TProperty["type"] extends ItemRef<string> ? ItemRef<string>
  : (TProperty["type"] extends keyof TTypeMap ? TTypeMap[TProperty["type"]]
    : never);

type AnyRecord = Record<string, any>;

function ref<T extends string>(schema: ItemSchema<T>) {
  return { ref: schema.id as T };
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
  | ItemRef<T>;

export interface ItemRef<T extends string> {
  ref: T;
}

// An ItemSchema could satisfy multiple schema.org types.

if (import.meta.main) {
  interface TypeMap {
    "https://schema.org/Text": string;
    "https://schema.org/DateTime": string;
    "https://schema.org/Boolean": boolean;
    "https://schema.org/Date": string;
    "https://schema.org/Time": string;
    "https://schema.org/Number": number;
    "https://example.com/Species": ItemOf<typeof speciesSchema, TypeMap>;
    "https://example.com/Dog": ItemOf<typeof dogSchema, TypeMap>;
  }

  const speciesSchema = {
    id: "https://example.com/Species",
    properties: {
      classification: { type: "https://schema.org/Text" },
      lifespan: { type: "https://schema.org/Number" },
      habitat: { type: "https://schema.org/Text" },
    },
  } as const satisfies ItemSchema<keyof TypeMap>;

  type Species = ItemOf<typeof speciesSchema, TypeMap>;

  const species: Species = {
    classification: "Mammal",
    lifespan: 10,
    habitat: "Land",
  };
  console.log(species);

  const dogSchema = {
    id: "https://example.com/Dog",
    properties: {
      name: { type: "https://schema.org/Text" },
      age: { type: "https://schema.org/Number" },
      // breed: { type: "https://example.com/Breed" },
      species: { type: ref(speciesSchema) },
    },
  } as const satisfies ItemSchema<keyof TypeMap>;

  type Dog = ItemOf<typeof dogSchema, TypeMap>;

  const dog: Dog = {
    name: "Fido",
    age: 3,
    species: { ref: "https://example.com/species/dog" },
  };
  console.log(dog);
}
