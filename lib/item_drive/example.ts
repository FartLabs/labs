import { InMemoryDataSource } from "./in_memory_data_source.ts";
import { ItemDrive } from "./item_drive.ts";

// deno run -A lib/item_drive/example.ts
if (import.meta.main) {
  const dataSource = new InMemoryDataSource();
  const itemDrive = new ItemDrive(dataSource);
  const item1 = await itemDrive.insertItem({
    itemType: "person",
    attributes: [
      {
        itemID: "persons/Ethan",
        factID: "persons/Ethan/name",
        attribute: "name",
        value: ["Ethan"],
      },
    ],
  });

  // TODO: Fix bugs.
  const item = await itemDrive.fetchItem(item1.itemID);
  console.log({ item1, item });
}
