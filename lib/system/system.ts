import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import type { View } from "labs/lib/services/view.ts";

export class System {
  public constructor(
    private readonly ctx: SystemContext,
  ) {}
}

export interface SystemContext {
  // deno-lint-ignore no-explicit-any
  itemDrive: ItemDrive<any>;
  actionsRouter: ActionsRouter;
  viewRenderer: ViewRenderer;

  // Start-up automation/action is stored in automation service and triggered on start-up.
}

export interface ActionsRouter {
  execute(
    serviceName: string,
    actionName: string,
    params: Record<string, unknown>,
  ): void;
}

export interface ViewRenderer {
  render(
    componentName: string,
    props?: Record<string, unknown>,
    slots?: Record<string, View[]>,
  ): void;
}
