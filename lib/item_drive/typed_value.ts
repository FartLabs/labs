export interface TypedValue {
  type: TypedValueType;
  value: string;
  numericalValue?: number;
  // attribute?: string;
}

export type TypedValueType = (typeof VALUE_TYPES)[number];

export const VALUE_TYPES = [
  "text",
  "number",
  "date_time",
  "boolean",
  "item_id",
] as const;

export function toValue(
  numericalValue: number | undefined,
  type: TypedValueType,
): string {
  if (numericalValue === undefined) {
    return "";
  }

  switch (type) {
    case "number": {
      return `${numericalValue}`;
    }

    case "boolean": {
      return numericalValue ? "true" : "false";
    }

    case "date_time": {
      return new Date(numericalValue).toISOString();
    }

    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}

export function toNumericalValue(
  value: string,
  type: TypedValueType,
): number | undefined {
  if (value === "") {
    return;
  }

  switch (type) {
    case "text":
    case "item_id": {
      return;
    }

    case "number": {
      return parseFloat(value);
    }

    case "boolean": {
      return value === "true" ? 1 : 0;
    }

    case "date_time": {
      return Date.parse(value);
    }

    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}
