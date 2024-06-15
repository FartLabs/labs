const speciesSchema = {
  properties: {
    name: { type: "string" },
    classification: { type: "string" },
    lifespan: { type: "number" },
    habitat: { type: "string" },
  },
} as const satisfies ItemSchema;

const dogSchema = {
  properties: {
    name: { type: "string" },
    age: { type: "number" },
    breed: { type: "string" },
    species: { type: speciesSchema.id },
  },
} as const satisfies ItemSchema;

export interface ItemSchema {
  properties: {
    [propertyName: string]: ItemProperty;
  };
}

export interface ItemProperty {
  repeatable?: boolean;
  type: string;
}
