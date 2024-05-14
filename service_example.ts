import { ItemDriveService } from "./service.ts";

//
// Run:
// deno run service_example.ts
//
if (import.meta.main) {
  const service = new ItemDriveService()
    .setItemType(
      "person",
      { name: "string", age: "number" },
    );
  service.setItem(
    "person",
    "alice",
    { name: "Alice", age: 42 },
  );
  const item = service.getItem("person", "alice");
  console.log({ item });
}

//
// TODO:
// - Associate item types with actions in a system.
// - Associate this service with other services e.g. higher-order service management, ui rendering, etc.
//
