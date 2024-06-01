import { parse } from "@std/yaml";
// import { InMemoryDataSource } from "labs/lib/data_source/in_memory.ts";
import { FSDataSource, jsonPathFromPrefix } from "labs/lib/data_source/fs.ts";
import { ItemDrive } from "labs/lib/item_drive/mod.ts";
// import { Space, SpaceService } from "labs/lib/services/space.ts";
// import { View, ViewService } from "labs/lib/services/view.ts";
// import { HTMLViewRenderer } from "labs/lib/view_renderer/mod.ts";
import { ServicesManager, System, SystemEvent } from "labs/lib/system/mod.ts";
import {
  fromActionID,
  // makeRenderAutomation,
  // withStep,
} from "labs/lib/system/automations.ts";
import { Automation, AutomationService } from "labs/lib/services/automation.ts";
import { List, ListService } from "labs/lib/services/list.ts";
import { Todo, TodoService } from "labs/lib/services/todo.ts";
import { UUID, UUIDService } from "labs/lib/services/uuid.ts";
import { Empty, EmptyService } from "labs/lib/services/empty.ts";

// TODO: Create automation that gets all the references of an item and adds references to a list of items.
// TODO: Create a type-safe mechanism to use within actions for referencing the given item drive with other item types.
// Guarantees that the item drive has the expected name and types.

if (import.meta.main) {
  console.log("Initializing system...");
  const dataSource = new FSDataSource(jsonPathFromPrefix("./_data/"));
  // TODO: Visualize graph of data sources, item drives, and services.
  const itemDrive = new ItemDrive<{
    automation: Automation;
    list: List;
    todo: Todo;
    // TODO: Register UUID service.
    uuid: UUID;
    empty: Empty;
  }>(dataSource);
  const listService = new ListService(itemDrive);
  const automationService = new AutomationService(itemDrive);
  const todoService = new TodoService(itemDrive);
  const uuidService = new UUIDService(itemDrive);
  const emptyService = new EmptyService(itemDrive);
  const servicesManager = new ServicesManager({
    list: listService,
    todo: todoService,
    uuid: uuidService,
    automation: automationService,
    empty: emptyService,
  });
  const actionIDs = servicesManager.getActionIDs();
  const actionAutomations = actionIDs.map((actionID) => fromActionID(actionID));
  const automations = [
    ...actionAutomations,
    // // Append render step to each action automation.
    // // Target specific action to render views.
    // makeRenderAutomation({ serviceName: "view", actionName: "render" }),
    // // TODO: Figure out how this works to print views.
    // ...actionAutomations.map((automation) =>
    //   withStep(
    //     { ...automation, name: `${automation.name} then render` },
    //     { run: { automation: "render" } },
    //   )
    // ),
  ].toSorted((a, b) => a.name.localeCompare(b.name));

  // TODO: Delete deprecated automations.
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
  // TODO: Validate props with jsonSchema referenced to the automation step.

  // Add a todo to the system.
  system.automate({
    automationName: "todo.set",
    props: { name: "test-todo" },
  });

  // TODO: Represent Pokemon TCG cards as items.

  // Add a physical item to the system.
  system.automate({
    automationName: "empty.set",
    props: { name: "rubicks-cube-1", title: "Rubick's Cube" },
  });

  // Add a physical container to the system.
  system.automate({
    automationName: "list.addItems",
    props: {
      name: "my-toy-box",
      items: [{ type: "empty", name: "rubicks-cube-1" }],
    },
  });

  system.automate({
    automationName: "list.getItems",
    props: { name: "my-toy-box" },
  });

  // system.automate({
  //   automationName: "orderedList.addList",
  //   props: {
  //     name: "test-orderedList",
  //     referenceItems: [{ type: "todo", name: "test-todo" }],
  //   },
  // });

  // // TODO: Test out view rendering.
  // system.automate({
  //   automationName: "orderedList.getList",
  //   props: { name: "test-orderedList" },
  // });

  // while (true) {
  //   const event = promptEvent(automations);
  //   if (!event) {
  //     break;
  //   }

  //   system.automate(event);
  // }
}

function promptEvent(automations: Automation[]): SystemEvent | null {
  const automationNumber = prompt(
    "Enter automation number to run (or 'q' to quit):",
  );
  if (automationNumber === null || automationNumber === "q") {
    return null;
  }

  const index = parseInt(automationNumber, 10) - 1;
  if (Number.isNaN(index) || index < 0 || index >= automations.length) {
    console.log("Invalid automation number.");
    return promptEvent(automations);
  }

  const automation = automations[index];
  console.log(`Selected automation: ${automation.name}`);
  const props = promptProps(automation); // TODO.
  return { automationName: automation.name, props };
}

function promptProps(automation: Automation): unknown | null {
  const propsString = prompt("Enter JSON or YAML props (or 'q' to quit):");
  if (propsString === null || propsString === "q") {
    return null;
  }

  if (propsString === "") {
    return {};
  }

  try {
    return parse(propsString);
  } catch (error) {
    console.error("Invalid JSON props:", error);
    return promptProps(automation);
  }
}

function printAutomations(automations: Automation[]): void {
  console.log("Automations:");
  automations.forEach((automation, i) => printAutomation(automation, i));
}

function printAutomation(automation: Automation, index: number): void {
  const automationNumber = (index + 1).toString().padEnd(3, " ");
  const description = automation.description
    ? `: ${automation.description}`
    : "";
  console.log(`${automationNumber} ${automation.name}${description}`);
}
