import type { Item, PartialItem } from "./item.ts";
import type { Fact, PartialFact } from "./fact.ts";
import type { FactQuery } from "./queries.ts";

export interface ItemDriveInterface extends DataSourceInterface {
  insertItem(item: PartialItem): Promise<Item>;
  insertItems(items: PartialItem[]): Promise<Item[]>;
  fetchItems(query: FactQuery): Promise<Item[]>;
  fetchItem(itemID: string): Promise<Item>;
}

export interface DataSourceInterface {
  insertFact(fact: PartialFact): Promise<Fact>;
  insertFacts(facts: PartialFact[]): Promise<Fact[]>;
  fetchFacts(query: FactQuery): Promise<Fact[]>;
  fetchFact(factID: string): Promise<Fact>;
}
