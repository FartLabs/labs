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
}

// TODO: Compose item drives of various data sources e.g. filesystem, database, in-memory, etc.
// Note: Item drives of different data sources must have the same standard schema type to be composed.
