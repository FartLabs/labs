import { codegenLab } from "labs/codegen/codegen.ts";

await Deno.writeTextFile(
  "./my_lab.ts",
  codegenLab.execute("codegen.lab", {
    name: "myLab",
    labsImportSource: "labs/labs.ts",
    extends: [
      { import: { name: "notesLab", source: "labs/notes.ts" } },
      { import: { name: "linksLab", source: "labs/links.ts" } },
    ],
  }),
);
