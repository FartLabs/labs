import { FSDataSource } from "labs/lib/data_source/fs.ts";
import { InMemoryDataSource } from "labs/lib/data_source/in_memory.ts";
import { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { Reference, ReferenceService } from "labs/lib/services/reference.ts";
import { Space, SpaceService } from "labs/lib/services/space.ts";
import { View, ViewService } from "labs/lib/services/view.ts";
import { Automation, AutomationService } from "labs/lib/services/automation.ts";
import { ActionID, ServicesManager, System } from "./mod.ts";
import { SystemIO } from "labs/lib/system/system_io.ts";

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
  const viewService = new ViewService(itemDrive);
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
  const automations = getAutomationsFromActions(actions);
  automationService.itemDrive.setItems(
    "automation",
    automations.map((automation) => [automation.name, automation]),
  );
  console.log(`${actions.length} actions initialized.`);

  // TODO: Refactor SystemIO to SystemAdapter that wraps a System.
  const system = new System(
    itemDrive,
    automationService,
    servicesManager,
  );

  interface CLIEvent {
    automationName: string;
  }

  // TODO: Abstract away the SystemIO class.
  const systemIO = new SystemIO(
    (event: CLIEvent) => {
      const automation = automationService.itemDrive.getItem(
        "automation",
        event.automationName,
      );
      const action = console.log(
        `Triggering action ${action.serviceName}.${action.actionName}.`,
      );

      // Actions should be a list of actions and automations.
      const isAction = true;
      if (isAction) {
        return servicesManager.executeAction(
          action.serviceName,
          action.actionName,
          {},
        );
      } else {
        return system.automate({});
      }
    },
    (output) => {
      console.log({ output });
      return Promise.resolve();
    },
  );

  while (true) {
    const automations = automationService.itemDrive.getItems("automation")
      .sort(([a], [b]) => a.localeCompare(b));
    console.log("Automations:");
    automations.forEach(([automationName], i) => {
      const automationNumber = (i + 1).toString().padEnd(3, " ");
      console.log(`${automationNumber} ${automationName}`);
    });

    const input = prompt("Enter automation number to execute:");
    if (input === null) {
      break;
    }

    if (input === "" || input === "exit") {
      console.log("Goodbye!");
      break;
    }

    const automationIndex = parseInt(input) - 1;
    const automation = automations[automationIndex];
    if (automation === undefined) {
      console.log("Invalid automation number.");
      continue;
    }

    systemIO.handle({ code: automationIndex });
  }

  // TODO: Initialize home space.
  // TODO: Print ui to console.
  // TODO: Move to on system on start up event and trigger it manually when system starts.
  // system.automate({
  //   automationName: "start-up",
  //   event: { eventType: "manual-dispatch", props: { actor: "system" } },
  // });

  // for await (const output of systemIO.output()) {
  //   console.log({ output });
  // }
}

// System's automationService is a primary service for managing automations.

// TODO: Define JSON interface that represents a system definition to be generated into TypeScript.

// Inpirations:
// LMS: Quizlet, Khan Academy
// Research/knowledge: Wikipedia, Google Scholar
// Productivity: Notion, Trello, GitHub

function getAutomationsFromActions(actions: ActionID[]): Automation[] {
  return actions.map((action) => ({
    name: `${action.serviceName}.${action.actionName}`,
    steps: [{ run: action }],
  }));
}
