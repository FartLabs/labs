import { InMemoryDataSource } from "labs/lib/data_source/in_memory.ts";
import { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { Reference, ReferenceService } from "labs/lib/services/reference.ts";
import { Space, SpaceService } from "labs/lib/services/space.ts";
import { View, ViewService } from "labs/lib/services/view.ts";
import { Automation, AutomationService } from "labs/lib/services/automation.ts";
import { ServicesManager, System } from "./mod.ts";

if (import.meta.main) {
  const dataSource = new InMemoryDataSource();
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

  // TODO: Initialize home space.
  // TODO: Print ui to console.

  const system = new System(
    itemDrive,
    automationService,
    new ServicesManager({
      view: viewService,
      reference: referenceService,
      space: spaceService,
    }),
    //  {
    //   render(
    //     componentName: string,
    //     props?: Record<string, unknown>,
    //     slots?: Record<string, View[]>,
    //   ): void {
    //   },
    // },
  );

  automationService.itemDrive.setItem("automation", "start-up", {
    name: "start-up",
    steps: [
      {
        name: "start-up",
        // TODO: Replace action expression with pair of service name and action name.
        run: { service: "view", action: "render" },
        defaultState: { viewName: "home" },
      },
    ],
  });
  system.automate({ automationName: "start-up" });
}
