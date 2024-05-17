import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import type { View } from "labs/lib/services/view.ts";
import {
  AutomationRun,
  AutomationService,
  isAutomationRunAction,
  isAutomationRunAutomation,
} from "labs/lib/services/automation.ts";

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
    const state = { ...trigger.state };
    automation.steps.forEach((step) => {
      if (step.defaultState !== undefined) {
        Object.assign(state, step.defaultState);
      }

      if (isAutomationRunAction(step.run)) {
        this.servicesManager.executeAction(
          step.run.service,
          step.run.action,
          state,
        );
      } else if (isAutomationRunAutomation(step.run)) {
        this.automate({
          event: {
            from: { run: step.run, from: trigger.event },
          },
          automationName: step.run.automation,
          state,
        });
      }
    });
  }

  // public addEventListener(eventName: string, listener: () => void): void {
  // }
}

export interface SystemTrigger {
  automationName: string;
  state?: Record<string, unknown>;
  event?: SystemTriggerEvent;
}

export interface SystemTriggerEvent {
  from: {
    run: AutomationRun;
    from?: SystemTriggerEvent;
  };
}

export class ServicesManager {
  public constructor(
    // deno-lint-ignore no-explicit-any
    private readonly services: Record<string, any> = {},
    private readonly filterAction = defaultFilterAction,
  ) {}

  /**
   * executeAction executes an action with the given state.
   */
  public executeAction(
    serviceName: string,
    actionName: string,
    state?: Record<string, unknown>,
  ): unknown {
    const service = this.services[serviceName];
    if (service === undefined) {
      throw new Error(`Service ${serviceName} not found.`);
    }

    const action = service[actionName];
    if (typeof action !== "function") {
      throw new Error(`Action ${serviceName}.${actionName} not found.`);
    }

    const id: ActionID = { serviceName, actionName };
    if (!this.filterAction(id)) {
      throw new Error(`Action ${serviceName}.${actionName} not allowed.`);
    }

    return action(state);
  }

  /**
   * listActions returns a list of actions that can be executed.
   */
  public listActions(): ActionID[] {
    const actions: ActionID[] = [];
    for (const serviceName in this.services) {
      const service = this.services[serviceName];
      for (const actionName in service) {
        const id: ActionID = { serviceName, actionName };
        if (
          typeof service[actionName] !== "function" || !this.filterAction(id)
        ) {
          continue;
        }

        actions.push(id);
      }
    }

    return actions;
  }
}

export function defaultFilterAction(_id: ActionID): boolean {
  return true;
}

export interface ActionID {
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
