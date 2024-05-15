import type { DataSource } from "./data_source.ts";

export class SynchronizedDataSource implements DataSource {
  public constructor(
    private readonly dataSources: DataSource[],
  ) {}

  public getItem<TType extends string, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    const item = this.dataSources[0]?.getItem(type, name);
    if (item) {
      return item as TItem;
    }
  }

  public getItems<TType extends string, TItem>(
    type: TType,
  ): Array<[string, TItem]> {
    return this.dataSources[0]?.getItems(type) ?? [];
  }

  public setItem<TType extends string, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    this.dataSources.forEach((dataSource) => {
      dataSource.setItem(type, name, item);
    });
  }

  public setItems<TType extends string, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    this.dataSources.forEach((dataSource) => {
      dataSource.setItems(type, items);
    });
  }

  public deleteItem<TType extends string>(
    type: TType,
    name: string,
  ): void {
    this.dataSources.forEach((dataSource) => {
      dataSource.deleteItem(type, name);
    });
  }

  public deleteItems<TType extends string>(type: TType): void {
    this.dataSources.forEach((dataSource) => {
      dataSource.deleteItems(type);
    });
  }
}
