/**
 * DataSource is the source of data for an item drive.
 */
export interface DataSource {
  getItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
  ): Promise<TItem | undefined>;
  getItems<TCollection extends string, TItem>(
    collection: TCollection,
  ): Promise<Array<[string, TItem]>>;
  setItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
    item: TItem,
  ): Promise<void>;
  setItems<TCollection extends string, TItem>(
    collection: TCollection,
    items: Array<[string, TItem]>,
  ): Promise<void>;
  deleteItem<TCollection extends string>(
    collection: TCollection,
    name: string,
  ): Promise<void>;
  deleteItems<TCollection extends string>(
    collection: TCollection,
  ): Promise<void>;
}
