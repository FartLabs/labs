import { notesLab } from "./notes.ts";

// deno run -A example.ts
//
// Proof-of-concept Lab.
// Features:
// - add notes via datasource resource, get notes via datasource resource, and list notes via datasource resource.
// - ability to dynamically create datasources and relate items between datasources.
//
// TODO: Add ability to get stored data from itemsLab across other stores.
// Perhaps a new lab that introduces a procedure that assigns procedure names to datasources.
// TODO: Add notes and media labs.
//
if (import.meta.main) {
  const note1 = notesLab.execute("notes.add", { content: "Hello, world!" });
  const note2 = notesLab.execute("notes.add", { content: "Goodbye, world!" });
  notesLab.execute("items.link", { a: note1.id, b: note2.id });

  // TODO: Second argument is not needed for procedures that feature an empty request.
  const links = notesLab.execute("items.listLinks", { id: note1.id });
  console.log(links);
}
