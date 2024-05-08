import { generateLab } from "./generate.ts";

await Deno.writeTextFile(
  "./codegen/codegen_lab.ts",
  generateLab({
    name: "codegenLab",
    labsImportSource: "labs/labs.ts",
    procedures: [
      {
        name: "codegen.lab",
        import: {
          name: "generateLab",
          source: "labs/codegen/generate.ts",
        },
      },
    ],
  }),
);
