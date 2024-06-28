import { InMemoryDataSource } from "./in_memory_data_source.ts";
import { ItemDrive } from "./item_drive.ts";

// deno run -A lib/item_drive/example.ts
if (import.meta.main) {
  const dataSource = new InMemoryDataSource();
  const itemDrive = new ItemDrive(dataSource);
  const item = await itemDrive.insertItem({
    itemID: "persons/Ethan",
    itemType: "person",
    attributes: [
      {
        factID: "persons/Ethan/name",
        attribute: "name",
        value: ["Ethan"],
      },
      {
        factID: "persons/Ethan/birthday",
        type: "date_time",
        attribute: "birthday",
        numericalValue: [new Date("2001-03-24").getTime()],
      },
    ],
  });

  const result = await itemDrive.fetchItem(item.itemID);
  console.log({ result });
}
