export interface LabDescriptor {
  name: string;
  labsImportSource?: ImportSource;
  extends?: ExtendDescriptor[];
  variables?: VariableDescriptor[];
  procedures?: ProcedureDescriptor[];
}

export interface VariableDescriptor {
  name: string;
  value: string;
}

export interface ExtendDescriptor {
  import: Importable;
}

export interface ProcedureDescriptor {
  name: string;
  import: Importable;
}

export interface Importable {
  name: ImportName;
  source: ImportSource;
}

export type ImportSource = string;
export type ImportName = string;
