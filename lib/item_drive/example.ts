import { InMemoryDataSource } from "./in_memory_data_source.ts";
import { ItemDrive } from "./item_drive.ts";

// deno run -A lib/item_drive/example.ts
if (import.meta.main) {
  const dataSource = new InMemoryDataSource();
  const itemDrive = new ItemDrive(dataSource);
  // How do I make the Facts optional for only the insert methods?
  const item = await itemDrive.insertItem({
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
  console.log({ item });
}
