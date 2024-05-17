import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { View, ViewService } from "./view.ts";
import { ReferenceService, toReferenceName } from "./reference.ts";

/**
 * SpaceService is a service for managing spaces.
 */
export class SpaceService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ space: Space }>,
    public readonly viewService: ViewService,
    public readonly referenceService: ReferenceService,
  ) {}

  /**
   * getViews lists the views referenced in a space.
   */
  public getViews(spaceName: string): View[] {
    const referencedViewsName = toReferenceName({
      type: "space",
      name: spaceName,
      property: "views",
    });
    const referencedViews = this.referenceService.itemDrive.getItem(
      "reference",
      referencedViewsName,
    );
    if (referencedViews === undefined) {
      throw new Error(`Referenced views not found: ${spaceName}`);
    }

    return referencedViews.references.map((reference) => {
      const view = this.viewService.itemDrive.getItem("view", reference.name);
      if (view === undefined) {
        throw new Error(`View not found: ${reference.name}`);
      }

      return view;
    });
  }
}

/**
 * Space is a collection of views.
 */
export interface Space {
  name: string;
  description?: string;
}
