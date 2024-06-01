import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { ActionID } from "labs/lib/system/services_manager.ts";

// TODO: Create log service to store logs for recursive automation runs.

export class AutomationService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ automation: Automation }>,
  ) {}
}

/**
 * Automation describes a reusable automation as a serializable object.
 */
export interface Automation {
  readonly name: string;
  readonly description?: string;
  readonly steps: AutomationStep[];
}

/**
 * AutomationStep describes a step in an automation.
 */
export interface AutomationStep {
  readonly run: AutomationRun;
  readonly name?: string;
  readonly description?: string;
  readonly defaultProps?: Record<string, unknown>;
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
  readonly automation: string;
}
