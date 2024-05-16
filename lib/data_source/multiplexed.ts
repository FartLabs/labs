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

  private getDataSource<TType extends string>(
    type: TType,
  ): DataSource {
    const dataSource = this.dataSources.get(type);
    if (!dataSource) {
      throw new Error(`Unknown data source: ${type.toString()}`);
    }

    return dataSource;
  }

  public getItem<TType extends string, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    return this.getDataSource(type).getItem(type, name);
  }

  public getItems<TType extends string, TItem>(
    type: TType,
  ): Array<[string, TItem]> {
    return this.getDataSource(type).getItems(type);
  }

  public setItem<TType extends string, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    this.getDataSource(type).setItem(type, name, item);
  }

  public setItems<TType extends string, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    this.getDataSource(type).setItems(type, items);
  }

  public deleteItem<TType extends string>(
    type: TType,
    name: string,
  ): void {
    this.getDataSource(type).deleteItem(type, name);
  }

  public deleteItems<TType extends string>(type: TType): void {
    this.getDataSource(type).deleteItems(type);
  }
}
