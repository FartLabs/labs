import { FSDataSource } from "labs/lib/data_source/fs.ts";
import { InMemoryDataSource } from "labs/lib/data_source/in_memory.ts";
import { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { Reference, ReferenceService } from "labs/lib/services/reference.ts";
import { Space, SpaceService } from "labs/lib/services/space.ts";
import { View, ViewService } from "labs/lib/services/view.ts";
import { Automation, AutomationService } from "labs/lib/services/automation.ts";
import { System, SystemEvent } from "./system.ts";
import { ServicesManager } from "./services_manager.ts";
import {
  fromActionID,
  makeRenderAutomation,
  withStep,
} from "labs/lib/system/automations.ts";
import { HTMLViewRenderer } from "labs/lib/view_renderer/mod.ts";

if (import.meta.main) {
  console.log("Initializing system...");
  const dataSource = new FSDataSource();
  // TODO: Visualize graph of data sources, item drives, and services.
  const itemDrive = new ItemDrive<{
    reference: Reference;
    space: Space;
    view: View;
    automation: Automation;
  }>(dataSource);
  const htmlRenderer = new HTMLViewRenderer();
  const viewService = new ViewService(itemDrive, htmlRenderer);
  const referenceService = new ReferenceService(itemDrive);
  const automationService = new AutomationService(itemDrive);
  const spaceService = new SpaceService(
    itemDrive,
    viewService,
    referenceService,
  );
  const servicesManager = new ServicesManager({
    view: viewService,
    reference: referenceService,
    space: spaceService,
    automation: automationService,
  });
  const actions = servicesManager.getActions();
  const actionAutomations = actions.map((action) => fromActionID(action));
  const automations = [
    ...actionAutomations,
    // Append render step to each action automation.
    // Target specific action to render views.
    makeRenderAutomation({ serviceName: "view", actionName: "render" }),
    ...actionAutomations.map((automation) =>
      withStep(automation, { run: { automation: "render" } })
    ),
  ].toSorted((a, b) => a.name.localeCompare(b.name));

  automationService.itemDrive.setItems(
    "automation",
    automations.map((automation) => [automation.name, automation]),
  );
  console.log(`${automations.length} automations loaded.`);

  // TODO: Refactor SystemIO to SystemAdapter that wraps a System.
  const system = new System(
    itemDrive,
    automationService,
    servicesManager,
  );

  printAutomations(automations);

  while (true) {
    const event = promptEvent(automations);
    if (!event) {
      break;
    }

    system.automate(event);
  }
}

function promptEvent(automations: Automation[]): SystemEvent | null {
  const automationNumber = prompt(
    "Enter automation number to run (or 'q' to quit):",
  );
  if (automationNumber === null || automationNumber === "q") {
    return null;
  }

  const index = parseInt(automationNumber, 10);
  if (Number.isNaN(index) || index < 0 || index >= automations.length) {
    console.log("Invalid automation number.");
    return promptEvent(automations);
  }

  const automation = automations[index];
  const props = promptProps(automation); // TODO.
  return { automationName: automation.name, props };
}

function printAutomations(automations: Automation[]): void {
  console.log("Automations:");
  automations.forEach((automation, i) => printAutomation(automation, i));
}

function printAutomation(automation: Automation, index: number): void {
  const automationNumber = index.toString().padEnd(3, " ");
  const description = automation.description
    ? `: ${automation.description}`
    : "";
  console.log(`${automationNumber} ${automation.name}${description}`);
}
