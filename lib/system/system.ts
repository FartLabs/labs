import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import type { View } from "labs/lib/services/view.ts";
import { AutomationService } from "labs/lib/services/automation.ts";

export class System {
  public constructor(
    // deno-lint-ignore no-explicit-any
    private readonly itemDrive: ItemDrive<any>,
    private readonly automationService: AutomationService,
    private readonly servicesManager: ServicesManager,
    // Start-up automation/action is stored in automation service and triggered on start-up.
    // Load automations and their trigger listeners on start-up.
    // on app load, fetch new data from data sources and sync with item drives. trigger a rerender on update.
  ) {}

  public automate(trigger: SystemTrigger): void {
    const automation = this.automationService.itemDrive.getItem(
      "automation",
      trigger.automationName,
    );
    if (!automation) {
      throw new Error(`Automation ${trigger.automationName} not found.`);
    }

    // TODO: Handle inputs, outputs, and persistent state.
    let state = { ...trigger.state };
    automation.steps.forEach((step) => {
      if (step.defaultState !== undefined) {
        state = Object.assign(state, step.defaultState);
      }

      this.servicesManager.executeActionExpression(step.actionName, state);
    });
  }

  // public addEventListener(eventName: string, listener: () => void): void {
  // }
}

export interface SystemTrigger {
  automationName: string;
  state: Record<string, unknown>;
}

export class ServicesManager {
  public constructor(
    // deno-lint-ignore no-explicit-any
    private readonly services: Record<string, any> = {},
    private readonly filterAction = defaultFilterAction,
    private readonly encodeActionExpression = defaultEncodeActionExpression,
    private readonly decodeActionExpression = defaultDecodeActionExpression,
  ) {}

  public executeActionExpression(
    actionExpression: string,
    state: Record<string, unknown>,
  ): unknown {
    const decoded = this.decodeActionExpression(actionExpression);
    if (!this.filterAction(decoded)) {
      throw new Error(`Expression ${actionExpression} not allowed.`);
    }

    const service = this.services[decoded.serviceName];
    if (service === undefined) {
      throw new Error(`Service ${decoded.serviceName} not found.`);
    }

    const action = service[decoded.actionName];
    if (typeof action !== "function") {
      throw new Error(`Action ${decoded.actionName} not found.`);
    }

    return action(state);
  }

  public listActionExpressions(): string[] {
    const actionExpressions: string[] = [];
    for (const serviceName in this.services) {
      const service = this.services[serviceName];
      for (const actionName in service) {
        if (
          typeof service[actionName] !== "function" ||
          !this.filterAction({ serviceName, actionName })
        ) {
          continue;
        }

        actionExpressions.push(
          this.encodeActionExpression({ serviceName, actionName }),
        );
      }
    }

    return actionExpressions;
  }
}

export function defaultEncodeActionExpression(action: Action): string {
  return `${action.serviceName}.${action.actionName}`;
}

export function defaultDecodeActionExpression(
  actionExpression: string,
): Action {
  const parts = actionExpression.split(".");
  if (parts.length !== 2) {
    throw new Error(`Invalid action expression ${actionExpression}.`);
  }

  return { serviceName: parts[0], actionName: parts[1] };
}

export function defaultFilterAction(_action: Action): boolean {
  return true;
}

export interface Action {
  serviceName: string;
  actionName: string;
}

export interface ViewRenderer {
  render(
    componentName: string,
    props?: Record<string, unknown>,
    slots?: Record<string, View[]>,
  ): void;
}
