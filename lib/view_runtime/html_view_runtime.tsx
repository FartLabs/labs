// import { ItemDrive } from "labs/lib/item_drive/item_drive.ts";
// import { View } from "labs/lib/services/view.ts";
import { RuntimeView } from "./view_runtime.ts";
import { P } from "@fartlabs/htx";

// TODO: Diagram relationship between view, view runtime, runtime view, and component.

export class ViewRuntime {
  public constructor(
    public readonly componentProvider: ComponentProvider,
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
      { slots },
    );
    return <HTMLComponent component={component} props={props} />;
  }
}

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

const htmlComponents: Record<string, Component> = { Paragraph };

interface ComponentProvider {
  getComponent(componentName: string): Component | undefined;
}

/**
 * HTMLComponent is a runtime for rendering views with HTML components.
 */
export function HTMLComponent(props: { component: Component; props?: Props }) {
  return props.component(props.props);
}

/**
 * Paragraph renders an HTML paragraph.
 */
export function Paragraph(props: { text: string }) {
  return <P>{props.text}</P>;
}

type Component = (props: Props) => any;

type Props = any;
