import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

export class ReferenceService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ reference: Reference }>,
  ) {}

  // TODO: Rethink semantics of reference operations.
  // TODO: Explore how to use generic types for specialized reference services.

  public reference(a: ReferenceItem, b: ReferenceItem) {
    this.directedReference(a, b);
    this.directedReference(b, a);
  }

  public directedReference(a: ReferenceItem, b: ReferenceItem) {
    const referenceName = toReferenceName(a);
    const reference = this.itemDrive.getItem("reference", referenceName);
    this.itemDrive.setItem(
      "reference",
      referenceName,
      { references: (reference?.references ?? []).concat(b) },
    );
  }

  public dereference(a: ReferenceItem, b: ReferenceItem) {
    this.directedDereference(a, b);
    this.directedDereference(b, a);
  }

  public directedDereference(a: ReferenceItem, b: ReferenceItem) {
    const aName = toReferenceName(a);
    const reference = this.itemDrive.getItem("reference", aName);
    if (reference === undefined) {
      return;
    }

    const bName = toReferenceName(b);
    this.itemDrive.setItem("reference", aName, {
      references: reference.references.filter(
        (reference) => toReferenceName(reference) !== bName,
      ),
    });
  }
}

export function toReferenceName({ type, name, property }: ReferenceItem) {
  return `${type}.${name}${property ? `.${property}` : ""}`;
}

export interface Reference {
  readonly references: ReferenceItem[];
}

export interface ReferenceItem {
  readonly type: string;
  readonly name: string;
  readonly property?: string;
}
