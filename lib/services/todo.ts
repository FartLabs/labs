import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * TodoService provides a service for managing todos.
 */
export class TodoService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ todo: Todo }>,
  ) {}

  public list(): [string, Todo][] {
    return this.itemDrive.getItems("todo");
  }

  public get(props: { name: string }): Todo | undefined {
    return this.itemDrive.getItem("todo", props.name);
  }

  public set(props?: { name?: string; done?: boolean }): void {
    const name = props?.name ?? crypto.randomUUID();
    this.itemDrive.setItem(
      "todo",
      name,
      { done: props?.done ?? false },
    );
  }

  public done(props: { name: string; done?: boolean }): void {
    this.set({ name: props.name, done: props.done ?? true });
  }
}

/**
 * Todo represents a todo item.
 */
export interface Todo {
  readonly done: boolean;
}
