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

  // Consider replacing action expression with service+action name pair to simplify the system API e.g. no need for expression encoding and decoding.
  // Determine how to invoke another automation as a step.
  actionName: string;
  defaultState?: Record<string, unknown>;
}
