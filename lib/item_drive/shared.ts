import { ulid } from "@std/ulid";
import type { TypedValue, TypedValueType } from "./shared/typed_value.ts";
import { toNumericalValue, toValue } from "./shared/typed_value.ts";

export interface ItemDriveInterface extends DataSource {
  insertItem(item: Partial<Item>): Promise<Item>;
  insertItems(items: Partial<Item>[]): Promise<Item[]>;
  fetchItems(query: ItemQuery): Promise<Item[]>;
  fetchItem(itemID: string): Promise<Item>;
}

export interface DataSource {
  insertFact(fact: Partial<Fact>): Promise<Fact>;
  insertFacts(facts: Partial<Fact>[]): Promise<Fact[]>;
  fetchFacts(query: FactQuery): Promise<Fact[]>;
  fetchFact(factID: string): Promise<Fact>;
}

export interface ItemQuery {
  itemID?: string;
  attributes?: AttributeQuery[];
}

export const DEFAULT_FACT_TYPE = "text" as const satisfies TypedValueType;

export function makeFact(fact: Partial<Fact>): Fact {
  if (fact.attribute === undefined) {
    throw new Error("Attribute is required");
  }

  if (fact.value === undefined && fact.numericalValue === undefined) {
    throw new Error("One of value or numericalValue is required");
  }

  const timestamp = fact.timestamp ?? new Date();
  const factID = fact.factID ?? ulid(timestamp.getTime());
  const itemID = fact.itemID ?? ulid(timestamp.getTime());
  const type = fact.type ?? DEFAULT_FACT_TYPE;
  const value = fact.value ?? toValue(fact.numericalValue, type);
  const numericalValue = fact.numericalValue ?? toNumericalValue(value, type);
  return {
    factID,
    itemID,
    timestamp,
    type,
    value,
    numericalValue,
    attribute: fact.attribute,
    discarded: fact.discarded ?? false,
  };
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
