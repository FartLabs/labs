import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import {
  AutomationService,
  isAutomationRunAction,
  isAutomationRunAutomation,
} from "labs/lib/services/automation.ts";
import { ServicesManager } from "./services_manager.ts";

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

  public automate(event: SystemEvent): void {
    const automation = this.automationService.itemDrive.getItem(
      "automation",
      event.automationName,
    );
    if (!automation) {
      throw new Error(`Automation ${event.automationName} not found.`);
    }

    // Consider storing outputs in an array to reference by name in later steps.
    const props = { ...(event.props || {}) };
    automation.steps.forEach((step) => {
      if (step.defaultProps !== undefined) {
        // Consider deep merge algorithm for composite states.
        Object.assign(props, step.defaultProps);
      }

      if (isAutomationRunAction(step.run)) {
        console.log(
          `Running action ${step.run.serviceName}.${step.run.actionName}`,
          props,
        );
        this.servicesManager.executeAction(
          step.run.serviceName,
          step.run.actionName,
          props,
        );
      } else if (isAutomationRunAutomation(step.run)) {
        this.automate({
          automationName: step.run.automation,
          props,
          from: event,
        });
      }
    });
  }
}

export interface SystemEvent {
  automationName: string;
  props?: unknown;
  from?: SystemEvent;
}

export interface SystemComponentRenderer {
  (component: SystemComponent): void;
}

export interface SystemComponent {
  componentName: string;
  props: unknown;
  children: SystemComponent[];
}
