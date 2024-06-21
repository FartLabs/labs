import type {
  DataSource,
  Fact,
  FactQuery,
  Item,
  ItemDriveInterface,
  ItemQuery,
} from "./shared.ts";
import { factsFrom, makeItem } from "./shared.ts";

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
