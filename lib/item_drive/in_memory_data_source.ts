import { ulid } from "@std/ulid";
import type { Fact } from "./fact.ts";
import { toNumericalValue, toValue } from "./typed_value.ts";
import type { DataSource, FactQuery } from "./data_source.ts";

export class InMemoryDataSource implements DataSource {
  public constructor(
    public factsByItemID: Map<string, Map<string, Fact>> = new Map(),
    public itemIDByFactID: Map<string, string> = new Map(),
  ) {}

  public insertFact(partialFact: Partial<Fact>): Promise<void> {
    const fact = makeFact(partialFact);
    const allFacts = this.factsByItemID.get(fact.itemID) ?? new Map();
    this.factsByItemID.set(fact.itemID, allFacts.set(fact.factID, fact));
    this.itemIDByFactID.set(fact.factID, fact.itemID);
    return Promise.resolve();
  }

  public async insertFacts(facts: Partial<Fact>[]): Promise<void> {
    const timestamp = new Date();
    for (const fact of facts) {
      await this.insertFact({
        ...fact,
        timestamp: fact.timestamp ?? timestamp,
      });
    }

    return Promise.resolve();
  }

  public fetchFacts(query: FactQuery): Promise<Fact[]> {
    if (query.itemID === undefined) {
      return Promise.resolve([]);
    }

    const allFacts = this.factsByItemID.get(query.itemID);
    if (allFacts === undefined) {
      return Promise.resolve([]);
    }

    let facts = Array.from(allFacts.values());
    if (query.attribute !== undefined) {
      facts = facts.filter((fact) => fact.attribute === query.attribute);
    }

    if (query.type !== undefined) {
      facts = facts.filter((fact) => fact.type === query.type);
    }

    return Promise.resolve(facts);
  }

  public fetchFact(factID: string): Promise<Fact> {
    const itemID = this.itemIDByFactID.get(factID);
    if (itemID === undefined) {
      throw new Error(`Fact not found: ${factID}`);
    }

    const facts = this.factsByItemID.get(itemID);
    if (facts === undefined) {
      throw new Error(`Item not found: ${itemID}`);
    }

    const fact = facts.get(factID);
    if (fact === undefined) {
      throw new Error(`Fact not found: ${factID}`);
    }

    return Promise.resolve(fact);
  }
}

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
  const type = fact.type ?? "text";
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
    flags: fact.flags ?? 0,
  };
}
