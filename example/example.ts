import { myLab } from "./my_lab.ts";

if (import.meta.main) {
  main();
}

function main() {
  const note1 = myLab.execute(
    "notes.add",
    { content: "Hello, world!" },
  );
  const note2 = myLab.execute(
    "notes.add",
    { content: "Goodbye, world!" },
  );
  myLab.execute("links.link", { ids: [note1.id, note2.id] });

  console.log(`Note 1: ${note1.id}`);
  console.log(`Note 2: ${note2.id}`);
  console.log("Linked notes:");
  for (const linkable of myLab.execute("links.list", {})) {
    console.log(
      `- ${linkable.id} => ${linkable.links.map(({ id }) => id).join(", ")}`,
    );
  }
}
