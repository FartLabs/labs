import type { Fact } from "./fact.ts";

export interface DataSource {
  insertFact(fact: Partial<Fact>): Promise<Fact>;
  insertFacts(facts: Partial<Fact>[]): Promise<Fact[]>;
  fetchFacts(query: FactQuery): Promise<Fact[]>;
  fetchFact(factID: string): Promise<Fact>;
}

export interface FactQuery {
  itemID?: string;
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

export function checkFact(query: FactQuery, fact: Fact): boolean {
  return (
    (query.itemID === undefined || query.itemID === fact.itemID) &&
    (query.attributes === undefined ||
      query.attributes.every((attributeQuery) =>
        checkAttribute(attributeQuery, fact)
      ))
  );
}

export function checkAttribute(query: AttributeQuery, fact: Fact): boolean {
  return (
    fact.attribute === query.attribute &&
    (query.value === undefined ||
      query.value === fact.value) &&
    (query.valueAtOrAbove === undefined || fact.numericalValue === undefined ||
      query.valueAtOrAbove <= fact.numericalValue) &&
    (query.valueAtOrBelow === undefined || fact.numericalValue === undefined ||
      query.valueAtOrBelow >= fact.numericalValue) &&
    (query.createdAtOrAfter === undefined ||
      query.createdAtOrAfter <= fact.timestamp) &&
    (query.createdAtOrBefore === undefined ||
      query.createdAtOrBefore >= fact.timestamp)
  );
}
