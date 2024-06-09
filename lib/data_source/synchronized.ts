import type { DataSource } from "./data_source.ts";

// TODO: Roll back/retry operations on failure.

export class SynchronizedDataSource implements DataSource {
  public constructor(
    private readonly dataSources: DataSource[],
  ) {}

  public getItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
  ): Promise<TItem | undefined> {
    return this.dataSources[0]?.getItem(collection, name);
  }

  public getItems<TCollection extends string, TItem>(
    collection: TCollection,
  ): Promise<Array<[string, TItem]>> {
    return this.dataSources[0]?.getItems(collection);
  }

  public async setItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
    item: TItem,
  ) {
    await Promise.all(
      this.dataSources.map((dataSource) =>
        dataSource.setItem(collection, name, item)
      ),
    );
  }

  public async setItems<TCollection extends string, TItem>(
    collection: TCollection,
    items: Array<[string, TItem]>,
  ) {
    await Promise.all(
      this.dataSources.map((dataSource) =>
        dataSource.setItems(collection, items)
      ),
    );
  }

  public async deleteItem<TCollection extends string>(
    collection: TCollection,
    name: string,
  ) {
    await Promise.all(
      this.dataSources.map((dataSource) =>
        dataSource.deleteItem(collection, name)
      ),
    );
  }

  public async deleteItems<TCollection extends string>(
    collection: TCollection,
  ) {
    await Promise.all(
      this.dataSources.map((dataSource) => dataSource.deleteItems(collection)),
    );
  }
}
