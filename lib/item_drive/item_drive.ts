import type { DataSource, FactQuery } from "./data_source.ts";
import type { TypedValue } from "./typed_value.ts";
import { Fact } from "./fact.ts";

export interface Item {
  readonly itemID: string;
  readonly type: string;
  readonly attributes: Record<string, TypedValue>;
}

export interface ItemDriveInterface extends DataSource {
  insertItem(item: Partial<Item>): Promise<void>; // TODO: Argument as Partial. Return inserted items.
  insertItems(items: Partial<Item>[]): Promise<void>; // TODO: Argument as Partial. Return inserted items.
  fetchItems(query: ItemQuery): Promise<Item[]>;
  fetchItem(itemID: string): Promise<Item>;
}

export interface ItemQuery extends FactQuery {
}

function factsFrom(item: Partial<Item>): Partial<Fact>[] {
  if (item.attributes === undefined) {
    return [];
  }

  return Object.entries(item.attributes).map(([attribute, value]) => ({
    itemID: item.itemID,
    attribute,
    value: value.value,
    numericalValue: value.numericalValue,
    type: value.type,
    flags: 0,
  }));
}

export class ItemDrive implements ItemDriveInterface {
  public constructor(public dataSource: DataSource) {}

  public insertItem(item: Item): Promise<void> {
    return this.dataSource.insertFacts(factsFrom(item));
  }

  public insertItems(items: Item[]): Promise<void> {
    return this.dataSource.insertFacts(
      items.flatMap((item) => factsFrom(item)),
    );
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
