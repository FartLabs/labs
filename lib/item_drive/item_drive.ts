import { ulid } from "@std/ulid";
import type { AttributeQuery, DataSource, FactQuery } from "./data_source.ts";
import type { TypedValue } from "./typed_value.ts";
import { Fact } from "./fact.ts";

export interface Item {
  readonly itemID: string;
  readonly type: string;
  readonly attributes: Record<string, Fact>;
}

export interface ItemDriveInterface extends DataSource {
  insertItem(item: Partial<Item>): Promise<Item>;
  insertItems(items: Partial<Item>[]): Promise<Item[]>;
  fetchItems(query: ItemQuery): Promise<Item[]>;
  fetchItem(itemID: string): Promise<Item>;
}

export interface ItemQuery {
  itemID?: string;
  attributes?: AttributeQuery[];
}

export function factsFrom(item: Partial<Item>): Partial<Fact>[] {
  if (item.attributes === undefined) {
    return [];
  }

  return Object.entries(item.attributes).map(([attribute, value]) =>
    factFrom(attribute, value, item)
  );
}

export function factFrom(
  attribute: string,
  value: TypedValue,
  item?: Partial<Item>,
): Partial<Fact> {
  return {
    attribute,
    itemID: item?.itemID,
    value: value.value,
    numericalValue: value.numericalValue,
    type: value.type,
    discarded: false,
  };
}

export class ItemDrive implements ItemDriveInterface {
  public constructor(public dataSource: DataSource) {}

  public async insertItem(partialItem: Partial<Item>): Promise<Item> {
    const item = makeItem(partialItem);
    await this.dataSource.insertFacts(factsFrom(item));
    return item;
  }

  public async insertItems(partialItems: Partial<Item>[]): Promise<Item[]> {
    const items = partialItems.map((partialItem) => makeItem(partialItem));
    return await Promise.all(items.map((item) => this.insertItem(item)));
  }

  public fetchItems(query: ItemQuery): Promise<Item[]> {
    throw new Error("Not implemented");
  }

  public fetchItem(itemID: string): Promise<Item> {
    throw new Error("Not implemented");
  }

  public insertFact(partialFact: Partial<Fact>): Promise<Fact> {
    return this.dataSource.insertFact(partialFact);
  }

  public insertFacts(facts: Partial<Fact>[]): Promise<Fact[]> {
    return this.dataSource.insertFacts(facts);
  }

  public fetchFacts(query: FactQuery): Promise<Fact[]> {
    return this.dataSource.fetchFacts(query);
  }

  public fetchFact(factID: string): Promise<Fact> {
    return this.dataSource.fetchFact(factID);
  }
}

export function itemFrom(
  itemID: string,
  type: string,
  facts: Fact[],
): Item {
  return {
    itemID,
    type,
    attributes: Object.fromEntries(
      facts.map((fact) => [fact.attribute, fact]),
    ),
  };
}

export const DEFAULT_ITEM_TYPE = "empty" as const;

export function makeItem(
  partialItem: Partial<Item>,
  defaultItemType: string = DEFAULT_ITEM_TYPE,
  date = new Date(),
): Item {
  return {
    itemID: partialItem.itemID ?? ulid(date.getTime()),
    type: partialItem.type ?? defaultItemType,
    attributes: partialItem.attributes ?? {},
  };
}
