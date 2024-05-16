import type { JSONSchema } from "json-schema";
import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

export class JSONSchemaService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ jsonSchema: JSONSchema }>,
  ) {}
}

export { JSONSchema };

// import { compile } from "json-schema-to-typescript";
