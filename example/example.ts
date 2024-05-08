import { myLab } from "./my_lab.ts";

if (import.meta.main) {
  main();
}

function main() {
  const note1 = myLab.execute(
    "notes.add",
    { title: "Hi", content: "Hello, world!" },
  );
  const note2 = myLab.execute(
    "notes.add",
    { title: "Bye", content: "Goodbye, world!" },
  );
  myLab.execute(
    "links.link",
    { ids: [note1.id, note2.id] },
  );

  console.log(renderNote(note1.id));
}

function renderNote(id: string): string {
  const note = myLab.execute("notes.get", { id });
  if (!note) {
    throw new Error(`Note not found: ${id}`);
  }

  const title = renderTitle(note.title);
  const links = myLab.execute("links.get", { id });
  return `# [${title}](${id})

${note.content ?? "No content."}

## Links

${
    !links || links.links.length === 0 ? "None" : links.links.map(({ id }) => {
      const linkedNote = myLab.execute("notes.get", { id });
      if (!linkedNote) {
        throw new Error(`Linked note not found: ${id}`);
      }

      return `- [${renderTitle(linkedNote.title)}](${id})`;
    }).join("\n")
  }
`;
}

function renderTitle(title?: string): string {
  return title ?? "Untitled";
}
