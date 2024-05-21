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

  public automate(trigger: SystemTrigger): void {
    const automation = this.automationService.itemDrive.getItem(
      "automation",
      trigger.automationName,
    );
    if (!automation) {
      throw new Error(`Automation ${trigger.automationName} not found.`);
    }

    console.log(
      `Automating ${trigger.automationName} triggered by ${trigger.event.eventType}.`,
    );

    // TODO: Handle inputs, outputs, and persistent state.
    const state = { ...trigger.state };
    automation.steps.forEach((step) => {
      if (step.defaultState !== undefined) {
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
          event: {
            eventType: "automation",
            props: { automation: step.run.automation },
            from: trigger.event,
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

export interface ViewRenderer {
  render(
    componentName: string,
    props?: Record<string, unknown>,
    slots?: Record<string, View[]>,
  ): void;
}

// TODO: Consolidate trigger and event into a single type, SystemEvent.
export interface SystemTrigger {
  automationName: string;
  event: SystemTriggerEvent;
  state?: Record<string, unknown>;
}

export interface SystemTriggerEvent {
  eventType: string;
  props?: Record<string, unknown>; // Include ID of previous automation.
  from?: SystemTriggerEvent;
}

export interface SystemComponentRenderer {
  (component: SystemComponent): void;
}

export interface SystemComponent {
  componentName: string;
  props: Record<string, unknown>;
  children: SystemComponent[];
}
