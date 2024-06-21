import type {
  DataSourceInterface,
  Fact,
  FactQuery,
  Item,
  ItemDriveInterface,
} from "./shared/mod.ts";
import { factsFrom, makeItem } from "./shared/mod.ts";

export class ItemDrive implements ItemDriveInterface {
  public constructor(private dataSource: DataSourceInterface) {}

  public async insertItem(partialItem: Partial<Item>): Promise<Item> {
    const item = makeItem(partialItem);
    await this.dataSource.insertFacts(factsFrom(item));
    return item;
  }

  public async insertItems(partialItems: Partial<Item>[]): Promise<Item[]> {
    const items = partialItems.map((partialItem) => makeItem(partialItem));
    return await Promise.all(items.map((item) => this.insertItem(item)));
  }

  public async fetchItems(query: FactQuery): Promise<Item[]> {
    // 1st pass gathers all of the itemIDs that match the query.
    const itemIDs = new Set(
      (await this.dataSource.fetchFacts(query)).map((fact) => fact.itemID),
    );

    // 2nd pass fetches the items by their itemIDs.
    return await Promise.all(
      Array.from(itemIDs).map((itemID) => this.fetchItem(itemID)),
    );
  }

  public fetchItem(itemID: string): Promise<Item> {
    return this.dataSource
      .fetchFacts({ itemID: [itemID] })
      .then((facts) => {
        if (facts.length === 0) {
          throw new Error(`Item not found: ${itemID}`);
        }

        return makeItem({
          itemID,
          itemType: facts[0].itemType,
          attributes: Object.fromEntries(
            facts.map((fact) => [fact.attribute, fact]),
          ),
        });
      });
  }

  public insertFacts(partialFacts: Partial<Fact>[]): Promise<Fact[]> {
    return this.dataSource.insertFacts(partialFacts);
  }

  public insertFact(partialFact: Partial<Fact>): Promise<Fact> {
    return this.dataSource.insertFact(partialFact);
  }

  public fetchFacts(query: FactQuery): Promise<Fact[]> {
    return this.dataSource.fetchFacts(query);
  }

  public fetchFact(factID: string): Promise<Fact> {
    return this.dataSource.fetchFact(factID);
  }
}
