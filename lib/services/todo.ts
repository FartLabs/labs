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

// const context = {
//   "@context": {
//     rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
//     rdfs: "http://www.w3.org/2000/01/rdf-schema#",
//     schema: "https://schema.org/",
//   },
// };

// /**
//  * Property represents an RDF property.
//  */
// export interface Property {
//   readonly "@type": "rdf:Property";
//   readonly "rdfs:comment": string;
//   readonly "rdfs:label": string;
//   readonly "schema:rangeIncludes": string;
// }

// /**
//  * Todo represents a todo item.
//  */
// export interface Todo {
//   readonly "@type": "Todo";
//   // TODO: Define context of checkbox property.
//   readonly checkbox: ItemID<Checkbox>;
//   readonly children: ItemID[];
// }

// /**
//  * Checkbox represents a checkbox item.
//  */
// export interface Checkbox {
//   readonly "@type": "Checkbox";
//   readonly checked: boolean;
// }

// export interface Item {
//   readonly "@type": string;
// }

// /**
//  * ItemID is a unique identifier for an item.
//  */
// export interface ItemID<TItem extends Item = Item> {
//   readonly "@id": { type: TItem["@type"]; name: string };
// }
