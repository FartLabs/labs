import { Automation, AutomationStep } from "labs/lib/services/automation.ts";
import { ActionID } from "./services_manager.ts";

export function makeRenderAutomation(
  actionID: ActionID,
  name = "render",
): Automation {
  return withActionIDStep(makeAutomation(name), actionID);
}

export function fromActionID(actionID: ActionID): Automation {
  return withActionIDStep(
    makeAutomation(makeAutomationNameFromActionID(actionID)),
    actionID,
  );
}

export function makeAutomationNameFromActionID(actionID: ActionID): string {
  return `${actionID.serviceName}.${actionID.actionName}`;
}

export function makeAutomation(name: string): Automation {
  return { name, steps: [] };
}

export function withActionIDStep(
  automation: Automation,
  actionID: ActionID,
): Automation {
  return withStep(automation, { run: actionID });
}

export function withStep(
  automation: Automation,
  step: AutomationStep,
): Automation {
  automation.steps = automation.steps.concat([step]);
  return automation;
}

// export function getAutomationsFromActionIDs(actionIDs: ActionID[]): Automation[] {
//   // TODO: Generate automations that render view components from actions outputs.
//   return actionIDs.map((actionID) => ({
//     name: `${actionID.serviceName}.${actionID.actionName}`,
//     steps: [{ run: actionID }],
//   }));
// }
