const exampleSchema = {
  "$id": "https://example.com/calendar.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of an event",
  "type": "object",
  "required": ["startDate", "summary"],
  "properties": {
    "startDate": {
      "type": "string",
      "description": "Event starting time",
    },
    "endDate": {
      "type": "string",
      "description": "Event ending time",
    },
    "summary": {
      "type": "string",
    },
    "location": {
      "type": "string",
    },
    "url": {
      "type": "string",
    },
    "duration": {
      "type": "string",
      "description": "Event duration",
    },
    "recurrenceDate": {
      "type": "string",
      "description": "Recurrence date",
    },
    "recurrenceDule": {
      "type": "string",
      "description": "Recurrence rule",
    },
    "category": {
      "type": "string",
    },
    "description": {
      "type": "string",
    },
    // "geo": {
    //   "$ref": "https://example.com/geographical-location.schema.json",
    // },
  },
};

// deno run lib/prompt_jsonschema.ts
if (import.meta.main) {
  promptJSONSchema(exampleSchema);
}

export function promptJSONSchema(descriptor: JSONSchemaDescriptor) {
  // Prioritize required properties.
  const properties = Object.entries(descriptor.properties ?? {})
    .sort(([a], [b]) => {
      const aIncluded = descriptor?.required?.includes(a);
      const bIncluded = descriptor?.required?.includes(b);
      if (aIncluded && !bIncluded) {
        return -1;
      } else if (!aIncluded && bIncluded) {
        return 1;
      }

      return a.localeCompare(b);
    });
  console.log({ properties });
}

export type JSONSchemaDescriptor = // | JSONSchemaRefDescriptor
  JSONSchemaObjectDescriptor;

// export interface JSONSchemaRefDescriptor {
//   $ref: string;
// }

// TODO: Implement jsonschema local id system.
// TODO: Write prompt function that generates a prompt for a JSON schema.
// https://json-schema.org/blog/posts/get-started-with-json-schema-in-node-js
export interface JSONSchemaObjectDescriptor {
  $id?: string;
  type: string;
  description?: string;
  required?: string[];
  properties?: Record<string, JSONSchemaDescriptor>;
}
