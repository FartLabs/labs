import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * TodoService provides a service for managing todos.
 */
export class TodoService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ todo: Todo }>,
  ) {}

  public getAll(): [string, Todo][] {
    return this.itemDrive.getItems("todo");
  }

  public get(props: { name: string }): Todo | undefined {
    return this.itemDrive.getItem("todo", props.name);
  }

  public set(props: { todoName: string; done: boolean }): void {
    this.itemDrive.setItem("todo", name, { done: props.done });
  }
}

/**
 * Todo represents a todo item.
 */
export interface Todo {
  done: boolean;
}
