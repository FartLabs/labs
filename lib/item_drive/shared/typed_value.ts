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

export const BOOLEAN_FALSE = "false" as const;
export const BOOLEAN_FALSE_NUMERICAL = 0 as const;
export const BOOLEAN_TRUE = "true" as const;
export const BOOLEAN_TRUE_NUMERICAL = 1 as const;

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
      if (check(v, type)) {
        continue;
      }

      throw new Error(`Value check failed: ${v}`);
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

    return {
      type,
      repeatable,
      value: partial.value,
      numericalValue: partial.numericalValue,
    };
  }

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
      return value === BOOLEAN_TRUE || value === BOOLEAN_FALSE;
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

export function checkNumerical(
  numericalValue: number,
  type: TypedValueType,
): boolean {
  switch (type) {
    case "number":
    case "date_time": {
      return !isNaN(numericalValue);
    }

    case "boolean": {
      return numericalValue === BOOLEAN_TRUE_NUMERICAL ||
        numericalValue === BOOLEAN_FALSE_NUMERICAL;
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

export function match(
  value: string,
  numericalValue: number,
  type: TypedValueType,
): boolean {
  return value === toValue(numericalValue, type) &&
    numericalValue === toNumericalValue(value, type);
}

export function toValue(
  numericalValue: number,
  type: TypedValueType,
): string {
  if (!checkNumerical(numericalValue, type)) {
    throw new Error(
      `Invalid numerical value for type ${type}: ${numericalValue}`,
    );
  }

  switch (type) {
    case "number":
    case "item_id":
    case "text": {
      return `${numericalValue}`;
    }

    case "boolean": {
      return numericalValue ? BOOLEAN_TRUE : BOOLEAN_FALSE;
    }

    case "date_time": {
      return new Date(numericalValue).toISOString();
    }

    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}

export function toNumericalValue(value: string, type: TypedValueType): number {
  if (!check(value, type)) {
    throw new Error(`Invalid value for type ${type}: ${value}`);
  }

  switch (type) {
    case "number":
    case "text":
    case "item_id": {
      return parseFloat(value);
    }

    case "boolean": {
      return value === BOOLEAN_TRUE
        ? BOOLEAN_TRUE_NUMERICAL
        : BOOLEAN_FALSE_NUMERICAL;
    }

    case "date_time": {
      return Date.parse(value);
    }

    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}
