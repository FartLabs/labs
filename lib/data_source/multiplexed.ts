import type { DataSource } from "./data_source.ts";

export class MultiplexedDataSource implements DataSource {
  public constructor(
    private readonly dataSources: Map<string, DataSource>,
  ) {}

  public static fromDataSources(
    dataSources: Array<[string, DataSource]>,
  ): MultiplexedDataSource {
    return new MultiplexedDataSource(new Map(dataSources));
  }

  private getDataSource<TCollection extends string>(
    collection: TCollection,
  ): DataSource {
    const dataSource = this.dataSources.get(collection);
    if (!dataSource) {
      throw new Error(`Unknown data source: ${collection.toString()}`);
    }

    return dataSource;
  }

  public getItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
  ): Promise<TItem | undefined> {
    return this.getDataSource(collection).getItem(collection, name);
  }

  public getItems<TCollection extends string, TItem>(
    collection: TCollection,
  ): Promise<Array<[string, TItem]>> {
    return this.getDataSource(collection).getItems(collection);
  }

  public setItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
    item: TItem,
  ) {
    return this.getDataSource(collection).setItem(collection, name, item);
  }

  public setItems<TCollection extends string, TItem>(
    collection: TCollection,
    items: Array<[string, TItem]>,
  ) {
    return this.getDataSource(collection).setItems(collection, items);
  }

  public deleteItem<TCollection extends string>(
    collection: TCollection,
    name: string,
  ) {
    return this.getDataSource(collection).deleteItem(collection, name);
  }

  public deleteItems<TCollection extends string>(collection: TCollection) {
    return this.getDataSource(collection).deleteItems(collection);
  }
}
