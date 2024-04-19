export interface LabDescriptor {
  extends: ExtendDescriptor[];
  variables: VariableDescriptor[];
  procedures: ProcedureDescriptor[];
}

export interface ExtendDescriptor {
  name: string;
  importSource: string;
}

export interface VariableDescriptor {
  name: string;
  value: string;
}

export interface ProcedureDescriptor {
  name: string;
  importSource: string;
}

export function generateLab(descriptor: LabDescriptor): string {
  return "Lab";
}
