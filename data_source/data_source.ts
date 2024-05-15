/**
 * DataSource is the source of data for an item drive.
 */
export interface DataSource {
  getItem<TType extends string, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined;
  getItems<TType extends string, TItem>(
    type: TType,
  ): Array<[string, TItem]>;
  setItem<TType extends string, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ): void;
  setItems<TType extends string, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ): void;
  deleteItem<TType extends string>(
    type: TType,
    name: string,
  ): void;
  deleteItems<TType extends string>(
    type: TType,
  ): void;
}
