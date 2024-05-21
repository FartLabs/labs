// import { ItemDrive } from "labs/lib/item_drive/item_drive.ts";
// import { View } from "labs/lib/services/view.ts";
import { RuntimeView, ViewRenderer } from "./view_renderer.ts";
import { P } from "@fartlabs/htx";

// TODO: Diagram relationship between view, view runtime, runtime view, slot, and component.

export class HTMLViewRenderer implements ViewRenderer {
  public constructor(
    public readonly componentProvider: ComponentProvider =
      new HTMLComponentProvider(),
  ) {}

  public render(runtimeView: RuntimeView) {
    const component = this.componentProvider.getComponent(
      runtimeView.componentName,
    );
    if (component === undefined) {
      throw new Error(`Component ${runtimeView.componentName} not found.`);
    }

    const slots = composeValues(runtimeView?.defaultSlots, runtimeView?.slots);
    const props = composeValues(
      runtimeView?.defaultProps,
      runtimeView?.props,
      slots ? { slots } : undefined,
    );
    return component(props);
  }
}

// deno-lint-ignore no-explicit-any
function composeValues(...values: any[]) {
  if (values.every((value) => value === undefined)) {
    return;
  }

  // Consider: Using a deep merge instead of shallow merge for composite values.
  return values.reduce((a, b) => ({ ...a, ...b }), {});
}

export class HTMLComponentProvider implements ComponentProvider {
  public constructor(
    public readonly components = htmlComponents,
  ) {}

  public getComponent(componentName: string) {
    return htmlComponents[componentName];
  }
}

interface ComponentProvider {
  getComponent(componentName: string): Component | undefined;
}

const htmlComponents: Record<string, Component> = { Paragraph };

/**
 * Paragraph renders an HTML paragraph.
 */
export function Paragraph(props: { text: string }) {
  return <P>{props.text}</P>;
}

// deno-lint-ignore no-explicit-any
type Component = (props: Props) => any;

// deno-lint-ignore no-explicit-any
type Props = any;
