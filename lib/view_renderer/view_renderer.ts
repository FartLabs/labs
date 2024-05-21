import type { View } from "labs/lib/services/view.ts";

/**
 * ViewRenderer renders a view.
 */
export interface ViewRenderer {
  render(runtimeView: RuntimeView): unknown;
}

/**
 * RuntimeView is data needed at runtime to render a view.
 */
export interface RuntimeView extends View {
  props?: Record<string, unknown>;
  slots?: Record<string, RuntimeView[]>;
}
