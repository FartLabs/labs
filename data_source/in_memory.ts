import { DataSource } from "./data_source.ts";

/**
 * InMemoryStorage is an in-memory storage of items.
 */
export type InMemoryStorage = Map<string, Map<string, unknown>>;

export class InMemoryDataSource implements DataSource {
  public constructor(
    private readonly storage: InMemoryStorage = new Map(),
  ) {}

  public getItem<TType extends string, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    return this.storage.get(type)?.get(name) as TItem | undefined;
  }

  public getItems<TType extends string, TItem>(
    type: TType,
  ): Array<[string, TItem]> {
    return Array.from(
      this.storage.get(type)?.entries() ?? [],
    ) as Array<[string, TItem]>;
  }

  public setItem<TType extends string, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    const items = this.storage.get(type) ?? new Map();
    items.set(name, item);
    this.storage.set(type, items);
  }

  public setItems<TType extends string, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    const itemMap = new Map(items);
    this.storage.set(type, itemMap);
  }

  public deleteItem<TType extends string>(
    type: TType,
    name: string,
  ): void {
    this.storage.get(type)?.delete(name);
  }

  public deleteItems<TType extends string>(type: TType): void {
    this.storage.delete(type);
  }
}
