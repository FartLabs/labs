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
 * checkNumericalType returns true if the type is numerical.
 */
export function checkNumericalType(type: TypedValueType): boolean {
  return VALUE_TYPES[type].numerical;
}

export const VALUE_TYPES = {
  text: { numerical: false },
  number: { numerical: true },
  date_time: { numerical: true },
  boolean: { numerical: true },
  item_id: { numerical: false },
} as const satisfies Record<string, TypedValueTypeDefinition>;

export interface TypedValueTypeDefinition {
  numerical: boolean;
}

export function makeTypedValue(partial: Partial<TypedValue>): TypedValue {
  if (partial.value === undefined && partial.numericalValue === undefined) {
    throw new Error("One of value or numericalValue is required");
  }

  const type = partial.type ?? DEFAULT_TYPED_VALUE_TYPE;
  const isNumerical = checkNumericalType(type);
  if (!isNumerical && partial.numericalValue !== undefined) {
    throw new Error(`Numerical value is not allowed for type ${type}`);
  }

  const repeatable = partial.repeatable ?? false;
  if (
    !repeatable &&
    (partial.value !== undefined && partial.value.length !== 1 ||
      partial.numericalValue !== undefined &&
        partial.numericalValue.length !== 1)
  ) {
    throw new Error("Value and numericalValue must be an array of length 1");
  }

  if (partial.value !== undefined) {
    for (const v of partial.value) {
      if (!check(v, type)) {
        throw new Error(`Value check failed: ${v}`);
      }
    }
  }

  if (partial.numericalValue !== undefined) {
    for (const v of partial.numericalValue) {
      if (!checkNumerical(v, type)) {
        throw new Error(`NumericalValue check failed: ${v}`);
      }
    }
  }

  if (partial.value !== undefined && partial.numericalValue !== undefined) {
    if (partial.value.length !== partial.numericalValue.length) {
      throw new Error("Value and numericalValue must have the same length");
    }

    for (let i = 0; i < partial.value.length; i++) {
      if (!match(partial.value[i], partial.numericalValue[i], type)) {
        throw new Error(
          `Value and numericalValue check failed: ${partial.value[i]} !== ${
            partial.numericalValue[i]
          }`,
        );
      }
    }

    // Make a TypedValue with the given values and numerical values.
    return {
      type,
      repeatable,
      value: partial.value,
      numericalValue: partial.numericalValue,
    };
  }

  // Throw if value is undefined for a non-numerical type.
  if (!isNumerical && partial.value === undefined) {
    throw new Error("Expected value to be defined for non-numerical type");
  }

  return {
    type,
    repeatable,
    value: partial.value ??
      (partial.numericalValue!.map((v) => toValue(v, type))),
    numericalValue: partial.numericalValue ??
      (isNumerical
        ? partial.value?.map((v) => toNumericalValue(v, type))
        : undefined),
  };
}

export function check(value: string, type: TypedValueType): boolean {
  switch (type) {
    case "number": {
      return !isNaN(parseFloat(value));
    }

    case "boolean": {
      return value === "true" || value === "false";
    }

    case "date_time": {
      return !isNaN(Date.parse(value));
    }

    case "text":
    case "item_id": {
      return true;
    }

    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}

export function checkNumerical(value: number, type: TypedValueType): boolean {
  switch (type) {
    case "number": {
      return true;
    }

    case "boolean": {
      return value === 0 || value === 1;
    }

    case "date_time": {
      return true;
    }

    case "text":
    case "item_id": {
      return false;
    }

    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}

export function match(v1: string, v2: number, type: TypedValueType): boolean {
  return v1 === toValue(v2, type) && v2 === toNumericalValue(v1, type);
}

export function toValue(
  numericalValue: number,
  type: TypedValueType,
): string {
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

    case "text":
    case "item_id": {
      throw new Error(
        `Unexpected type ${type} conversion from numerical value ${numericalValue}`,
      );
    }

    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}

export function toNumericalValue(value: string, type: TypedValueType): number {
  switch (type) {
    case "number": {
      return parseFloat(value);
    }

    case "boolean": {
      return value === "true" ? 1 : 0;
    }

    case "date_time": {
      return Date.parse(value);
    }

    case "text":
    case "item_id": {
      throw new Error(`Cannot convert value to numerical for type ${type}`);
    }

    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}
