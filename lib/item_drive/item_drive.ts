import { DataSource } from "../data_source/mod.ts";

/**
 * ItemDriveSchema is a schema of an item drive.
 */
export type ItemDriveSchema = Record<string, unknown>;

/**
 * ItemDriveEventType is an event type of an item drive.
 */
export type ItemDriveEventType = "set" | "get" | "delete";

/**
 * ItemDriveEventDetail is a detail of an item drive event.
 */
export interface ItemDriveEventDetail<T> {
  collection: string;
  name: string;
  item?: T;
}

export class ItemDrive<TItemDriveSchema extends ItemDriveSchema> {
  private readonly eventTarget = new EventTarget();

  public constructor(private readonly dataSource: DataSource) {}

  /**
   * dispatch dispatches an item drive event.
   */
  private dispatch(
    type: ItemDriveEventType,
    detail: ItemDriveEventDetail<TItemDriveSchema[keyof TItemDriveSchema]>,
  ) {
    this.eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
    this.eventTarget.dispatchEvent(
      new CustomEvent(`${type}:${detail.collection}`, { detail }),
    );
    this.eventTarget.dispatchEvent(
      new CustomEvent(
        `${type}:${detail.collection}:${detail.name}`,
        { detail },
      ),
    );
  }

  /**
   * addEventListener adds an event listener.
   */
  public addEventListener(
    type: ItemDriveEventType,
    fn: (
      detail: ItemDriveEventDetail<TItemDriveSchema[keyof TItemDriveSchema]>,
    ) => void,
  ) {
    function handleEvent(event: Event) {
      fn((event as CustomEvent).detail);
    }

    this.eventTarget.addEventListener(type, handleEvent);
    return () => this.eventTarget.removeEventListener(type, handleEvent);
  }

  /**
   * setItem sets an item.
   */
  public async setItem<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
    name: string,
    item: TItemDriveSchema[TCollection],
  ) {
    await this.dataSource.setItem(collection.toString(), name, item);
    this.dispatch("set", { collection: collection.toString(), name, item });
  }

  /**
   * setItems sets items.
   */
  public async setItems<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
    items: Array<[string, TItemDriveSchema[TCollection]]>,
  ) {
    await this.dataSource.setItems(collection.toString(), items);
  }

  /**
   * getItem gets an item.
   */
  public async getItem<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
    name: string,
  ) {
    const item = await this.dataSource.getItem<
      string,
      TItemDriveSchema[TCollection]
    >(
      collection.toString(),
      name,
    );
    this.dispatch("get", { collection: collection.toString(), name, item });
    return item;
  }

  /**
   * getItems gets items.
   */
  public getItems<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
  ) {
    return this.dataSource.getItems<string, TItemDriveSchema[TCollection]>(
      collection.toString(),
    );
  }

  /**
   * deleteItem deletes an item.
   */
  public async deleteItem<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
    name: string,
  ) {
    await this.dataSource.deleteItem(collection.toString(), name);
    this.dispatch("delete", { collection: collection.toString(), name });
  }

  /**
   * deleteItems deletes items.
   */
  public deleteItems<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
  ) {
    return this.dataSource.deleteItems(collection.toString());
  }
}
