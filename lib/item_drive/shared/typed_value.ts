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

export type TypedValueType = keyof typeof VALUE_TYPES;

/**
 * checkNumeric returns true if the type is numeric.
 */
export function checkNumeric(type: TypedValueType): boolean {
  return VALUE_TYPES[type].numeric;
}

export const VALUE_TYPES = {
  text: { numeric: false },
  number: { numeric: true },
  date_time: { numeric: true },
  boolean: { numeric: true },
  item_id: { numeric: false },
} as const satisfies Record<string, TypedValueTypeDefinition>;

export interface TypedValueTypeDefinition {
  numeric: boolean;
}

export function makeTypedValue(partial: Partial<TypedValue>): TypedValue {
  if (partial.value === undefined && partial.numericalValue === undefined) {
    throw new Error("One of value or numericalValue is required");
  }

  const type = partial.type ?? DEFAULT_TYPED_VALUE_TYPE;
  const isNumeric = checkNumeric(type);
  if (!isNumeric && partial.numericalValue !== undefined) {
    console.log({ partial });
    throw new Error(`Numerical value is not allowed for type ${type}`);
  }

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

  let value = partial.value ??
    partial.numericalValue?.map((v) => toValue(v, type));
  const numericalValue = partial.numericalValue ??
    (isNumeric
      ? partial.value?.map((v) => {
        const n = toNumericalValue(v, type);
        if (n === undefined) {
          throw new Error(`Invalid value for type ${type}: ${v}`);
        }

        return n;
      })
      : undefined);
  if (value === undefined) {
    value = numericalValue?.map((v) => toValue(v, type));
  }

  return {
    type,
    repeatable,
    value: value as string[],
    numericalValue: numericalValue,
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
