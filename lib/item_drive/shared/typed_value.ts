export interface TypedValue {
  /**
   * type is the data type of the value.
   */
  type: TypedValueType;

  /**
   * repeatable indicates whether the value can be repeated.
   *
   * If true, the value and numericalValue array lengths may !== 1.
   */
  repeatable?: boolean;

  /**
   * value is the string representation of the value.
   */
  value: string[];

  /**
   * numericalValue is the numerical representation of the value.
   */
  numericalValue?: number[];
}

export const DEFAULT_TYPED_VALUE_TYPE =
  "text" as const satisfies TypedValueType;

export type TypedValueType = (typeof VALUE_TYPES)[number];

export const VALUE_TYPES = [
  "text",
  "number",
  "date_time",
  "boolean",
  "item_id",
] as const;

export function fromPartial(partial: Partial<TypedValue>): TypedValue {
  if (partial.value === undefined && partial.numericalValue === undefined) {
    throw new Error("One of value or numericalValue is required");
  }

  // TODO: numericalValue should be undefined in the type is one that can't be numerical.
  const type = partial.type ?? DEFAULT_TYPED_VALUE_TYPE;
  const repeatable = partial.repeatable ?? false;
  if (partial.value !== undefined && partial.numericalValue !== undefined) {
    if (partial.value.length !== partial.numericalValue.length) {
      throw new Error("Value and numericalValue must have the same length");
    }

    if (partial.value.length === 0) {
      throw new Error("Value and numericalValue must not be empty");
    }

    if (!repeatable && partial.value.length !== 1) {
      throw new Error("Value and numericalValue must be an array of length 1");
    }

    return {
      type,
      repeatable,
      value: partial.value,
      numericalValue: partial.numericalValue,
    };
  }

  let value: string[];
  let numericalValue: number[];
  if (partial.value !== undefined) {
    value = partial.value;
    numericalValue = partial.value.map((v) => {
      const n = toNumericalValue(v, type);
      if (n === undefined) {
        throw new Error(`Invalid value for type ${type}: ${v}`);
      }

      return n;
    });
  }

  if (partial.numericalValue !== undefined) {
    numericalValue = partial.numericalValue;
    value = partial.numericalValue.map((n) => toValue(n, type));
  }

  return {
    type,
    repeatable,
    value,
    numericalValue,
  };
}

export function check(v1: string, v2: number, type: TypedValueType): boolean {
  return v1 === toValue(v2, type) && v2 === toNumericalValue(v1, type);
}

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
