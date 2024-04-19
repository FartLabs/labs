import { generateLab } from "../codegen/codegen.ts";

await Deno.writeTextFile(
  "./my_lab.ts",
  generateLab({
    name: "myLab",
    labsImportSource: "../labs.ts",
    extends: [
      { import: { name: "notesLab", source: "../notes.ts" } },
      { import: { name: "linksLab", source: "../links.ts" } },
    ],
  }),
);
