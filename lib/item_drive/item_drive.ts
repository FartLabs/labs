import { ulid } from "@std/ulid";
import type { DataSource, FactQuery } from "./data_source.ts";
import type { TypedValue } from "./typed_value.ts";
import { Fact } from "./fact.ts";

export interface Item {
  readonly itemID: string;
  readonly type: string;
  readonly attributes: Record<string, TypedValue>;
}

export interface ItemDriveInterface extends DataSource {
  insertItem(item: Item): Promise<void>;
  insertItems(items: Item[]): Promise<void>;
  fetchItems(query: ItemQuery): Promise<Item[]>;
  fetchItem(itemID: string): Promise<Item>;
}

export interface ItemQuery extends FactQuery {
}

export class ItemDrive implements ItemDriveInterface {
  public constructor(public dataSource: DataSource) {}

  // https://github.com/alexobenauer/Wonder/tree/3e411bb837fd7e32616ba7ead19c162e7d5abb1e?tab=readme-ov-file#create-items
  public insertItem(item: Item): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public insertItems(items: Item[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public fetchItems(query: ItemQuery): Promise<Item[]> {
    throw new Error("Method not implemented.");
  }

  public fetchItem(itemID: string): Promise<Item> {
    throw new Error("Method not implemented.");
  }

  public insertFact(partialFact: Partial<Fact>): Promise<void> {
    return this.dataSource.insertFact(partialFact);
  }

  public insertFacts(facts: Partial<Fact>[]): Promise<void> {
    return this.dataSource.insertFacts(facts);
  }

  public fetchFacts(query: FactQuery): Promise<Fact[]> {
    return this.dataSource.fetchFacts(query);
  }

  public fetchFact(factID: string): Promise<Fact> {
    return this.dataSource.fetchFact(factID);
  }
}
