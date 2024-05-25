import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { View, ViewService } from "./view.ts";
import { ReferenceService } from "./reference.ts";
import { VectorService } from "labs/lib/services/vector.ts";

// A space references a list of items.
// An item references a 2d vector in the space, a list of possible views, and the current view.

/**
 * SpaceService is a service for managing spaces.
 */
export class SpaceService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ space: Space }>,
    public readonly referenceService: ReferenceService<{}>,
    // public readonly viewService: ViewService,
    // public readonly referenceService: ReferenceService,
    // public readonly vectorService: VectorService,
    // TODO: Use vector service.
  ) {}

  // A space is an item which various item types reference.
  // A view is the rendering instructions for an item.
  // A vector is location in a space. A 2d space uses 2d vectors.
  // A reference is a reference to an item or item property.

  // To get the render instructions for an action output, we need to:
  // - Get the space referenced by the action output.
  // - Get the views referenced by the space.
  // - Get the vectors of the views.
  // - Render the views at the vectors.

  /**
   * getViews lists the views referenced in a space.
   */
  public getViews(props: { name: string }): View[] {
    const referencedViewsName = toReferenceName({
      type: "space",
      name: props.name,
      property: "views",
    });
    const referencedViews = this.referenceService.itemDrive.getItem(
      "reference",
      referencedViewsName,
    );
    if (referencedViews === undefined) {
      throw new Error(`Referenced views not found: ${props.name}`);
    }

    // TODO: Merge views with vector values.
    return referencedViews.references.map((reference) => {
      const view = this.viewService.itemDrive.getItem("view", reference.name);
      if (view === undefined) {
        throw new Error(`View not found: ${reference.name}`);
      }

      // TODO: Get vector of view.

      return view;
    });
  }
}

/**
 * Space is a collection of views.
 */
export interface Space {
  readonly name: string;
  readonly description?: string;
}
