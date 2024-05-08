import type { ImportName, ImportSource, LabDescriptor } from "./types.ts";

export function importsOf(
  descriptor: LabDescriptor,
): Map<ImportSource, Set<ImportName>> {
  const imports = new Map<ImportSource, Set<ImportName>>();
  for (const extend of descriptor.extends ?? []) {
    if (!imports.has(extend.import.source)) {
      imports.set(extend.import.source, new Set());
    }

    imports.get(extend.import.source)!.add(extend.import.name);
  }

  for (const procedure of descriptor.procedures ?? []) {
    if (!imports.has(procedure.import.source)) {
      imports.set(procedure.import.source, new Set());
    }

    imports.get(procedure.import.source)!.add(procedure.import.name);
  }

  return imports;
}
