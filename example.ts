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
  const note1 = notesLab.execute(
    "notes.add",
    { content: "Hello, world!" },
  );
  const note2 = notesLab.execute(
    "notes.add",
    { content: "Goodbye, world!" },
  );
  notesLab.execute("links.addLink", { a: note1.id, b: note2.id });
  printLinkedNotes(note1.id);
  printLinkedNotes(note2.id);
}

function printLinkedNotes(id: string) {
  const linkedNotes = notesLab.execute("links.get", { id });
  console.log(`Note ${id} is linked with:`);
  if (linkedNotes === undefined || linkedNotes.links.length === 0) {
    console.log("- No linked notes.");
    return;
  }

  for (const link of linkedNotes.links) {
    console.log(`- Note ${link.id}`);
  }
}
