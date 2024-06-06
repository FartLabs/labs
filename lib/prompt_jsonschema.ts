const calendarEventSchema = {
  "$id": "https://example.com/calendar.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "description": "A representation of an event",
  "type": "object" as const,
  "required": ["startDate", "summary"],
  "properties": {
    "startDate": {
      "type": "string" as const,
      "description": "Event starting time",
    },
    "endDate": {
      "type": "string" as const,
      "description": "Event ending time",
    },
    "summary": {
      "type": "string" as const,
    },
    "location": {
      "type": "string" as const,
    },
    "url": {
      "type": "string" as const,
    },
    "duration": {
      "type": "string" as const,
      "description": "Event duration",
    },
    "recurrenceDate": {
      "type": "string" as const,
      "description": "Recurrence date",
    },
    "recurrenceDule": {
      "type": "string" as const,
      "description": "Recurrence rule",
    },
    "category": {
      "type": "string" as const,
    },
    "description": {
      "type": "string" as const,
    },
    // "geo": {
    //   "$ref": "https://example.com/geographical-location.schema.json",
    // },
  },
};

// deno run lib/prompt_jsonschema.ts
if (import.meta.main) {
  const calendarEvent = promptJSONSchema("calendarEvent", calendarEventSchema);
  console.log({ calendarEvent });
}

/**
 * promptJSONSchema prompts the user for input based on a JSON schema.
 */
export function promptJSONSchema(
  name: string,
  descriptor: JSONSchemaDescriptor,
  // options?: PromptJSONSchemaOptions,
) {
  console.log(makePromptMessage(name, descriptor));
  return promptJSONSchemaProperties(descriptor);

  // const inputType = options?.inputType ?? "default";
  // switch (inputType) {
  //   case "json": {
  //     return promptJSONSchemaJSON(descriptor);
  //   }

  //   case "yaml": {
  //     return promptJSONSchemaYAML(descriptor);
  //   }

  //   case "default": {
  //     return promptJSONSchemaProperties(descriptor);
  //   }

  //   default: {
  //     throw new Error(`Unsupported input type: ${options?.inputType}`);
  //   }
  // }
}

/**
 * promptJSONSchemaProperties prompts the user for input based on a JSON schema
 * object.
 */
function promptJSONSchemaProperties(descriptor: JSONSchemaObjectDescriptor) {
  const properties = getSortedProperties(descriptor);
  const result: Record<string, unknown> = {};
  for (const [name, property] of properties) {
    const value = promptJSONSchemaProperty(name, property);
    result[name] = value;
  }

  return result;
}

// /**
//  * PromptJSONSchemaOptions are the options for the promptJSONSchema function.
//  */
// export interface PromptJSONSchemaOptions {
//   inputType?: "default" | "json" | "yaml";
// }

/**
 * promptJSONSchemaProperty prompts the user for input based on a JSON schema
 * property.
 */
function promptJSONSchemaProperty(
  name: string,
  descriptor: JSONSchemaDescriptor,
) {
  switch (descriptor.type) {
    case "object": {
      console.log(makePromptMessage(name, descriptor));
      return promptJSONSchemaProperties(descriptor);
    }

    case "integer": {
      return promptJSONSchemaPropertyInteger(name, descriptor);
    }

    case "boolean": {
      return promptJSONSchemaPropertyBoolean(name, descriptor);
    }

    case "number": {
      return promptJSONSchemaPropertyNumber(name, descriptor);
    }

    case "string": {
      return promptJSONSchemaPropertyString(name, descriptor);
    }

    default: {
      throw new Error(`Unsupported JSON schema type: ${descriptor.type}`);
    }
  }
}

/** */

/**
 * promptJSONSchemaPropertyInteger prompts the user for an integer value.
 */
function promptJSONSchemaPropertyInteger(
  name: string,
  descriptor: JSONSchemaDescriptor,
) {
  const integerString = prompt(makePromptMessage(name, descriptor));
  if (integerString === null) {
    return null;
  }

  return parseInt(integerString);
}

/**
 * promptJSONSchemaPropertyBoolean prompts the user for a boolean value.
 */
function promptJSONSchemaPropertyBoolean(
  name: string,
  descriptor: JSONSchemaDescriptor,
) {
  const booleanString = prompt(
    `${makePromptMessage(name, descriptor)} (true|false)`,
  );
  if (booleanString === null) {
    return null;
  }

  return booleanString === "true";
}

/** */

/**
 * promptJSONSchemaPropertyNumber prompts the user for a number value.
 */
function promptJSONSchemaPropertyNumber(
  name: string,
  descriptor: JSONSchemaDescriptor,
) {
  const numberString = prompt(makePromptMessage(name, descriptor));
  if (numberString === null) {
    return null;
  }

  return parseFloat(numberString);
}

/**
 * promptJSONSchemaPropertyString prompts the user for a string value.
 */
function promptJSONSchemaPropertyString(
  name: string,
  descriptor: JSONSchemaDescriptor,
) {
  return prompt(makePromptMessage(name, descriptor));
}

function makePromptMessage(name: string, descriptor: JSONSchemaDescriptor) {
  if (descriptor.description === undefined) {
    return name;
  }

  return `${name}: ${descriptor.description}`;
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
  type: "object" | "integer" | "boolean" | "number" | "string";
  description?: string;
  required?: string[];
  properties?: Record<string, JSONSchemaDescriptor>;
}

// deno-lint-ignore no-explicit-any
export function validate(schema: JSONSchemaDescriptor, data: any): boolean {
  for (const propertyName in schema.properties) {
    if (
      schema.required?.includes(propertyName) &&
      data[propertyName] === undefined
    ) {
      return false;
    }

    switch (data[propertyName].type) {
      case "object": {
        return validate(schema.properties[propertyName], data[propertyName]);
      }

      case "integer":
      case "number": {
        if (typeof data[propertyName] !== "number") {
          return false;
        }

        break;
      }

      case "boolean": {
        if (typeof data[propertyName] !== "boolean") {
          return false;
        }

        break;
      }

      case "string": {
        if (typeof data[propertyName] !== "string") {
          return false;
        }

        break;
      }

      default: {
        throw new Error(
          `Unsupported JSON schema type: ${data[propertyName].type}`,
        );
      }
    }
  }

  return true;
}

// TODO: Render a list of todo items.

// Example of new linked data structure.

// Ability to recursively fetch data to compose an object.

// checkbox.my-checkbox: { done: false }
// text.my-text: { value: "Hello, world!" }

// What if I want to turn any item into a todo by connecting it to a checkbox?

// const checkboxService = new CheckboxService();
// const textService = new TextService();
// const todoService = new TodoService();

// A service:
// - Manages a collection of items.
// - Manages the relationships between items.
// - Manages the actions that can be performed on items.
// - Manages the data structure of items.
// - Manages the representation of items.
// - Manages the validation of items.

// TODO representation options:

// Option 1:
// todo.my-todo: {
//   checkbox: { "@id": "my-checkbox" },
//   checkbox: { "@id": "https://example.com/checkbox" },
//   checkbox: { "@id": { type: "checkbox", name: "my-checkbox" } },
//   // the items to be done, associated with the checkbox.
//   items: [ { "@id": { type: "text", name: "my-text" } } ],
// }

// Expose api for developers to define their own data structures.
// Expose api for developers to define their own actions, given the data structures.

// Option 2:
// todo.my-todo: { checkbox: "my-checkbox", text: "my-text" }

// Option 3:
// todo.my-todo: {
//   references: { checkbox: "my-checkbox", text: "my-text" },
// }

// Option 4:
// todo.my-todo: {

// The todo knows it is linked to the checkbox and text.
// How do the checkbox and text know they are linked to the todo?
// Additional data structure that connects the checkbox and text to the todo.
