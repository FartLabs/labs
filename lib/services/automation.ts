import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { ActionID } from "labs/lib/system/services_manager.ts";

export class AutomationService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ automation: Automation }>,
  ) {}
}

/**
 * Automation describes a reusable automation as a serializable object.
 */
export interface Automation {
  name: string;
  description?: string;
  steps: AutomationStep[];
}

/**
 * AutomationStep describes a step in an automation.
 */
export interface AutomationStep {
  run: AutomationRun;
  name?: string;
  description?: string;
  defaultProps?: Record<string, unknown>;
}

export type AutomationRun =
  | AutomationRunAction
  | AutomationRunAutomation;

export function isAutomationRunAction(
  run: AutomationRun,
): run is AutomationRunAction {
  return (run as AutomationRunAction).serviceName !== undefined &&
    (run as AutomationRunAction).actionName !== undefined;
}

export type AutomationRunAction = ActionID;

export function isAutomationRunAutomation(
  run: AutomationRun,
): run is AutomationRunAutomation {
  return (run as AutomationRunAutomation).automation !== undefined;
}

export interface AutomationRunAutomation {
  automation: string;
}
