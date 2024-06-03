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
  const properties = getSortedProperties(descriptor);
  console.log({ properties });
}

/**
 * getSortedProperties sorts the properties of a JSON schema descriptor by
 * required properties first, then by property name.
 */
function getSortedProperties(descriptor: JSONSchemaObjectDescriptor) {
  if (descriptor.properties === undefined) {
    return [];
  }

  return Object.entries(descriptor.properties)
    .sort(([a], [b]) => {
      const aRequired = descriptor.required?.includes(a);
      const bRequired = descriptor.required?.includes(b);
      if (aRequired && !bRequired) {
        return -1;
      } else if (!aRequired && bRequired) {
        return 1;
      }

      return a.localeCompare(b);
    });
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
