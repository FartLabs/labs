import type { Fact } from "./fact.ts";

export interface FactQuery {
  itemID?: string[];
  factID?: string[];
  attributes?: AttributeQuery[];
}

export interface AttributeQuery {
  attribute?: string;
  value?: string;
  valueAtOrAbove?: number;
  valueAtOrBelow?: number;
  createdAtOrAfter?: Date;
  createdAtOrBefore?: Date;
}

export function checkFact(fact: Fact, query: FactQuery): boolean {
  return (
    (query.itemID === undefined || query.itemID.includes(fact.itemID)) &&
    (query.factID === undefined || query.factID.includes(fact.factID)) &&
    (query.attributes === undefined ||
      query.attributes.every((attributeQuery) => (
        fact.attribute === attributeQuery.attribute &&
        (attributeQuery.value === undefined ||
          attributeQuery.value === fact.value) &&
        (attributeQuery.valueAtOrAbove === undefined ||
          fact.numericalValue === undefined ||
          attributeQuery.valueAtOrAbove <= fact.numericalValue) &&
        (attributeQuery.valueAtOrBelow === undefined ||
          fact.numericalValue === undefined ||
          attributeQuery.valueAtOrBelow >= fact.numericalValue) &&
        (attributeQuery.createdAtOrAfter === undefined ||
          attributeQuery.createdAtOrAfter <= fact.timestamp) &&
        (attributeQuery.createdAtOrBefore === undefined ||
          attributeQuery.createdAtOrBefore >= fact.timestamp)
      )))
  );
}
