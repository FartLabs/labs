import { ulid } from "@std/ulid";
import type { TypedValue } from "./typed_value.ts";
import { makeTypedValue } from "./typed_value.ts";
import { DEFAULT_ITEM_TYPE } from "./item.ts";

export type PartialFact = Partial<Fact>;

export interface Fact extends TypedValue {
  factID: string;
  itemID: string;
  itemType: string;
  attribute: string;
  timestamp: number;
  discarded: boolean;
}

export function makeFact(fact: PartialFact, date = new Date()): Fact {
  if (fact.attribute === undefined) {
    throw new Error("Attribute is required");
  }

  const timestamp = fact.timestamp ?? date.getTime();
  return {
    ...makeTypedValue(fact),
    timestamp,
    attribute: fact.attribute,
    factID: fact.factID ?? ulid(timestamp),
    itemID: fact.itemID ?? ulid(timestamp),
    itemType: fact.itemType ?? DEFAULT_ITEM_TYPE,
    discarded: fact.discarded ?? false,
  };
}

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
