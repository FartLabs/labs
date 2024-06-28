import type { Fact } from "./fact.ts";
import { checkNumeric } from "./typed_value.ts";

export interface FactQuery {
  itemID?: string[];
  factID?: string[];
  attributes?: AttributeQuery[];
}

export interface AttributeQuery {
  attribute: string;
  valueIncludes?: string[];
  valueExcludes?: string[];
  numericalValueIncludes?: number[];
  numericalValueExcludes?: number[];
  numericalValueIncludesAtOrAbove?: number;
  numericalValueIncludesAtOrBelow?: number;
  createdAtOrAfter?: number;
  createdAtOrBefore?: number;
}

export function checkFact(fact: Fact, query: FactQuery): boolean {
  const isNumeric = checkNumeric(fact.type);
  return (
    (query.itemID === undefined || query.itemID.includes(fact.itemID)) &&
    (query.factID === undefined || query.factID.includes(fact.factID)) &&
    (query.attributes === undefined ||
      query.attributes.every((attributeQuery) => (
        fact.attribute === attributeQuery.attribute &&
        (attributeQuery.valueIncludes === undefined ||
          fact.value.some((value) =>
            attributeQuery.valueIncludes !== undefined &&
            attributeQuery.valueIncludes.includes(value)
          )) &&
        (attributeQuery.valueExcludes === undefined ||
          fact.value.every((value) =>
            attributeQuery.valueExcludes !== undefined &&
            !attributeQuery.valueExcludes.includes(value)
          )) &&
        ((attributeQuery.numericalValueIncludes === undefined ||
          fact.numericalValue?.some((numericalValue) =>
            attributeQuery.numericalValueIncludes !== undefined &&
            attributeQuery.numericalValueIncludes.includes(numericalValue)
          )) ?? false) &&
        ((attributeQuery.numericalValueExcludes === undefined ||
          fact.numericalValue?.every((numericalValue) =>
            attributeQuery.numericalValueExcludes !== undefined &&
            !attributeQuery.numericalValueExcludes.includes(numericalValue)
          )) ?? false) &&
        ((attributeQuery.numericalValueIncludesAtOrAbove === undefined ||
          fact.numericalValue?.some((numericalValue) =>
            attributeQuery.numericalValueIncludesAtOrAbove !== undefined &&
            attributeQuery.numericalValueIncludesAtOrAbove <= numericalValue
          )) ?? false) &&
        ((attributeQuery.numericalValueIncludesAtOrBelow === undefined ||
          fact.numericalValue?.some((numericalValue) =>
            attributeQuery.numericalValueIncludesAtOrBelow !== undefined &&
            attributeQuery.numericalValueIncludesAtOrBelow >= numericalValue
          )) ?? false) &&
        (attributeQuery.createdAtOrAfter === undefined ||
          fact.timestamp >= attributeQuery.createdAtOrAfter) &&
        (attributeQuery.createdAtOrBefore === undefined ||
          fact.timestamp <= attributeQuery.createdAtOrBefore)
      )))
  );
}
