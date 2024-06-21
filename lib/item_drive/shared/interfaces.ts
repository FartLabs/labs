import type { Item } from "./item.ts";
import type { Fact } from "./fact.ts";
import type { FactQuery } from "./queries.ts";

export interface ItemDriveInterface extends DataSourceInterface {
  insertItem(item: Partial<Item>): Promise<Item>;
  insertItems(items: Partial<Item>[]): Promise<Item[]>;
  fetchItems(query: FactQuery): Promise<Item[]>;
  fetchItem(itemID: string): Promise<Item>;
}

export interface DataSourceInterface {
  insertFact(fact: Partial<Fact>): Promise<Fact>;
  insertFacts(facts: Partial<Fact>[]): Promise<Fact[]>;
  fetchFacts(query: FactQuery): Promise<Fact[]>;
  fetchFact(factID: string): Promise<Fact>;
}
