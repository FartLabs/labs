import { InMemoryDataSource } from "./in_memory_data_source.ts";
import { ItemDrive } from "./item_drive.ts";

// deno run -A lib/item_drive/example.ts
if (import.meta.main) {
  const dataSource = new InMemoryDataSource();
  const itemDrive = new ItemDrive(dataSource);
  const item = await itemDrive.insertItem({
    itemType: "person",
    attributes: [
      {
        attribute: "name",
        value: ["Ethan"],
      },
      {
        type: "date_time",
        attribute: "birthday",
        numericalValue: [new Date("2001-03-24").getTime()],
      },
    ],
  });

  // Is it supposed to fetch all items given an empty query?
  const result = await itemDrive.fetchItems({
    attributes: [
      // {
      //   attribute: "name",
      //   valueIncludes: ["Ethan"],
      // },
      // {
      //   attribute: "birthday",
      //   numericalValueIncludesAtOrAbove: new Date("2001-03-24").getTime(),
      // },
    ],
  });
  console.log({ item, result });
}
