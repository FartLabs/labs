import type { DataSource } from "./data_source.ts";

export class MultiplexedDataSource implements DataSource {
  public constructor(
    private readonly dataSources: Map<PropertyKey, DataSource>,
  ) {}

  private getDataSource<TType extends PropertyKey>(
    type: TType,
  ): DataSource {
    const dataSource = this.dataSources.get(type);
    if (!dataSource) {
      throw new Error(`Unknown data source: ${type.toString()}`);
    }

    return dataSource;
  }

  public getItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    return this.getDataSource(type).getItem(type, name);
  }

  public getItems<TType extends PropertyKey, TItem>(
    type: TType,
  ): Array<[string, TItem]> {
    return this.getDataSource(type).getItems(type);
  }

  public setItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    this.getDataSource(type).setItem(type, name, item);
  }

  public setItems<TType extends PropertyKey, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    this.getDataSource(type).setItems(type, items);
  }

  public deleteItem<TType extends PropertyKey>(
    type: TType,
    name: string,
  ): void {
    this.getDataSource(type).deleteItem(type, name);
  }

  public deleteItems<TType extends PropertyKey>(type: TType): void {
    this.getDataSource(type).deleteItems(type);
  }
}
