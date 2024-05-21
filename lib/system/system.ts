import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import type { View } from "labs/lib/services/view.ts";
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

    // Consider storing outputs in an array to reference in later steps.
    const state = { ...event.props };
    automation.steps.forEach((step) => {
      if (step.defaultState !== undefined) {
        // TODO: Consider deep merge algorithm for composite values.
        Object.assign(state, step.defaultState);
      }

      if (isAutomationRunAction(step.run)) {
        this.servicesManager.executeAction(
          step.run.serviceName,
          step.run.actionName,
          state,
        );
      } else if (isAutomationRunAutomation(step.run)) {
        this.automate({
          automationName: step.run.automation,
          props: state,
          from: event,
        });
      }
    });
  }

  // public addEventListener(eventName: string, listener: () => void): void {
  // }
}

export interface ViewRenderer {
  render(
    componentName: string,
    props?: Record<string, unknown>,
    slots?: Record<string, View[]>,
  ): void;
}

export interface SystemEvent {
  automationName: string;
  props?: Record<string, unknown>;
  from?: SystemEvent;
}

export interface SystemComponentRenderer {
  (component: SystemComponent): void;
}

export interface SystemComponent {
  componentName: string;
  props: Record<string, unknown>;
  children: SystemComponent[];
}
