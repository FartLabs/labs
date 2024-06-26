import { InMemoryDataSource } from "./in_memory_data_source.ts";
import { ItemDrive } from "./item_drive.ts";

// deno run -A lib/item_drive/example.ts
if (import.meta.main) {
  const dataSource = new InMemoryDataSource();
  const itemDrive = new ItemDrive(dataSource);
  // How do I make the Facts optional for only the insert methods?
  itemDrive.insertItem({
    itemType: "person",
    attributes: {
      // TODO: Might as well be a list of partial facts, right?
      name: {
        value: ["Alice"],
      },
    },
  });
}
