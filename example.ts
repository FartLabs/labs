import { notesLab } from "./notes.ts";

// deno run -A example.ts
//
// Proof-of-concept Lab.
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
  notesLab.execute("links.link", { ids: [note1.id, note2.id] });

  printLinkedNotes(note1.id);
  printLinkedNotes(note2.id);
}

function printLinkedNotes(id: string) {
  const noteA = notesLab.execute("notes.get", { id });
  console.log(`Note "${noteA?.content ?? "No content."}" is linked with:`);

  const linkedNotes = notesLab.execute("links.get", { id });
  if (linkedNotes === undefined || linkedNotes.links.length === 0) {
    console.log("- No linked notes.");
    return;
  }

  for (const link of linkedNotes.links) {
    const noteB = notesLab.execute("notes.get", { id: link.id });
    console.log(`- Note "${noteB?.content ?? "No content."}"`);
  }
}
