import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * ViewService is a service for managing views.
 */
export class ViewService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ view: View }>,
  ) {}
}

/**
 * View is a template for rendering a component given a set of props and slots.
 */
export interface View {
  /**
   * componentName is the name of the component to render.
   */
  componentName: string;

  /**
   * defaultProps are the default props for the component.
   */
  defaultProps?: Record<string, unknown>;

  /**
   * defaultSlots are the default named child views to render.
   */
  defaultSlots?: Record<string, View[]>;
}

// TODO: Include capability for view to reference json schema for validation.
