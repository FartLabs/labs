import { Lab } from "labs/labs.ts";
import { importsOf } from "./imports.ts";
import type {
  ExtendDescriptor,
  ImportName,
  ImportSource,
  LabDescriptor,
  ProcedureDescriptor,
  VariableDescriptor,
} from "./types.ts";

export const codegenLab = new Lab()
  .procedure("codegen.lab", generateLab);

export const LABS_IMPORT_SOURCE = "./labs.ts";

export function generateLab(descriptor: LabDescriptor): string {
  const instructions = generateInstructions(descriptor);
  return `import { Lab } from "${
    descriptor.labsImportSource ?? LABS_IMPORT_SOURCE
  }";
${generateImports(importsOf(descriptor))}
export const ${descriptor.name} = new Lab()${
    instructions.length === 0 ? "" : `\n${indent(...instructions)}`
  };\n`;
}

export function generateImports(
  imports: Map<ImportSource, Set<ImportName>>,
): string {
  const generated = Array.from(imports)
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([importSource, names]) => {
      return generateImport(Array.from(names).toSorted(), importSource);
    })
    .join("\n");
  if (generated.length === 0) {
    return "";
  }

  return `${generated}\n`;
}

export function generateImport(names: string[], importSource: string): string {
  return `import { ${names.join(", ")} } from "${importSource}"`;
}

export function generateInstructions(descriptor: LabDescriptor): string[] {
  const instructions: string[] = [];
  if (descriptor.extends) {
    instructions.push(...generateExtends(descriptor.extends));
  }

  if (descriptor.variables) {
    instructions.push(...generateVariables(descriptor.variables));
  }

  if (descriptor.procedures) {
    instructions.push(...generateProcedures(descriptor.procedures));
  }

  return instructions;
}

export function generateExtends(descriptors: ExtendDescriptor[]): string[] {
  return descriptors.map((descriptor) => generateExtend(descriptor));
}

export function generateExtend(descriptor: ExtendDescriptor): string {
  return `.extend(${descriptor.import.name})`;
}

export function generateVariables(descriptors: VariableDescriptor[]): string[] {
  return descriptors.map((descriptor) => generateVariable(descriptor));
}

export function generateVariable(descriptor: VariableDescriptor): string {
  return `.variable(${descriptor.name}, ${descriptor.value})`;
}

export function generateProcedures(
  descriptors: ProcedureDescriptor[],
): string[] {
  return descriptors.map((descriptor) => generateProcedure(descriptor));
}

export function generateProcedure(descriptor: ProcedureDescriptor): string {
  return `.procedure(${descriptor.name}, ${descriptor.import.name})`;
}

export function indent(...lines: string[]): string {
  return lines.map((line) => `  ${line}`).join("\n");
}
