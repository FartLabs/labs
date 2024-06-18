import type { Fact } from "./fact.ts";

export interface DataSource {
  insertFact(fact: Partial<Fact>): Promise<void>;
  insertFacts(facts: Partial<Fact>[]): Promise<void>;
  fetchFacts(query: FactQuery): Promise<Fact[]>;
  fetchFact(factID: string): Promise<Fact>;
}

export interface FactQuery {
  itemID?: string;
  attribute?: string;
  type?: string;
  // valueAtOrAbove?: number;
  // valueAtOrBelow?: number;
  // createdAtOrAfter?: Date;
  // createdAtOrBefore?: Date;
}
