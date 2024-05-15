import type { DataSource } from "./data_source.ts";

export class MultiplexedDataSource implements DataSource {
  public constructor(
    private readonly dataSources: Map<PropertyKey, DataSource>,
  ) {}

  public getItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    const dataSource = this.dataSources.get(type);
    if (!dataSource) {
      throw new Error(`Unknown data source: ${type.toString()}`);
    }

    return dataSource?.getItem(type, name);
  }

  public getItems<TType extends PropertyKey, TItem>(
    type: TType,
  ): Array<[string, TItem]> {
    const dataSource = this.dataSources.get(type);
    if (!dataSource) {
      throw new Error(`Unknown data source: ${type.toString()}`);
    }

    return dataSource.getItems(type);
  }

  public setItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    const dataSource = this.dataSources.get(type);
    if (!dataSource) {
      throw new Error(`Unknown data source: ${type.toString()}`);
    }

    dataSource.setItem(type, name, item);
  }

  public setItems<TType extends PropertyKey, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    const dataSource = this.dataSources.get(type);
    if (!dataSource) {
      throw new Error(`Unknown data source: ${type.toString()}`);
    }

    dataSource.setItems(type, items);
  }
}
