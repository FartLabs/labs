import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

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
  name: string;
  description?: string;
  action: AutomationAction;
}

/**
 * AutomationAction describes an action in an automation.
 */
export interface AutomationAction {
  name: string;
  description?: string;
  params?: AutomationActionParam[];
}

/**
 * AutomationActionParam describes a parameter in an automation action.
 */
export interface AutomationActionParam {
  name: string;
  description?: string;
  type: AutomationActionParamType;
}

/**
 * AutomationActionParamType describes a type of an automation action parameter.
 */
export type AutomationActionParamType =
  | "string"
  | "number"
  | "boolean"
  | "enum";
