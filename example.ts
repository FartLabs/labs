import { Lab } from "./labs.ts";
import { notesLab } from "./notes.ts";
import { linksLab } from "./links.ts";

const myLab = new Lab()
  .extend(notesLab)
  .extend(linksLab);

// deno run -A example.ts
//
// Proof-of-concept Lab.
//
if (import.meta.main) {
  const note1 = myLab.execute(
    "notes.add",
    { content: "Hello, world!" },
  );
  const note2 = myLab.execute(
    "notes.add",
    { content: "Goodbye, world!" },
  );
  myLab.execute("links.link", { linkIDs: [note1, note2] });

  printLinkedNotes(note1.id);
  printLinkedNotes(note2.id);
}

function printLinkedNotes(id: string) {
  const noteA = myLab.execute("notes.get", { id });
  console.log(`Note "${noteA?.content ?? "No content."}" is linked with:`);

  const linkedNotes = myLab.execute("links.get", { id });
  if (linkedNotes === undefined || linkedNotes.links.length === 0) {
    console.log("- No linked notes.");
    return;
  }

  for (const link of linkedNotes.links) {
    const noteB = notesLab.execute("notes.get", { id: link.id });
    console.log(`- Note "${noteB?.content ?? "No content."}"`);
  }
}
