import type { FactQuery } from "./data_source.ts";
import { DataSource } from "./data_source.ts";

export interface Item {
  readonly itemID: string;
  readonly name: string;
  readonly type: string;
  readonly flags: number;
}

export interface ItemDrive extends DataSource {
  insertItem(item: Item): Promise<void>;
  insertItems(items: Item[]): Promise<void>;
  fetchItems(): Promise<Item[]>;
  fetchItem(itemID: string): Promise<Item>;
}

export interface ItemQuery extends FactQuery {
}
