/**
 * DataSource is the source of data for an item drive.
 */
export interface DataSource {
  getItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined;
  getItems<TType extends PropertyKey, TItem>(
    type: TType,
  ): Array<[string, TItem]>;
  setItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ): void;
  setItems<TType extends PropertyKey, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ): void;
  deleteItem<TType extends PropertyKey>(
    type: TType,
    name: string,
  ): void;
  deleteItems<TType extends PropertyKey>(
    type: TType,
  ): void;
}
