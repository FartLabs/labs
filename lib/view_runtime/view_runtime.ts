import type { View } from "labs/lib/services/view.ts";

/**
 * ViewRuntime represents the runtime environment for rendering views.
 */
export interface ViewRuntime {
  render(runtimeView: RuntimeView): unknown;
}

/**
 * View is data needed at runtime to render a view.
 */
export interface RuntimeView extends View {
  props?: Record<string, unknown>;
  slots?: Record<string, RuntimeView[]>;
}
