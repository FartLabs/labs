import {
  Automation,
  AutomationRun,
  AutomationStep,
} from "labs/lib/services/automation.ts";
import { ActionID } from "./services_manager.ts";

export function fromActionID(actionID: ActionID): Automation {
  return withStep(
    makeAutomation(makeAutomationNameFromActionID(actionID)),
    { run: actionID },
  );
}

export function makeAutomationNameFromActionID(actionID: ActionID): string {
  return `${actionID.serviceName}.${actionID.actionName}`;
}

export function makeAutomation(name: string): Automation {
  return { name, steps: [] };
}

export function withStep(
  automation: Automation,
  step: AutomationStep,
): Automation {
  automation.steps.push(step);
  return automation;
}

export function makeRenderAutomation(
  run: AutomationRun,
  name = "render",
): Automation {
  return withStep(makeAutomation(name), { run });
}
