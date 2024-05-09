export class System {
  private readonly items: Map<string, Item> = new Map();

  constructor(
    private readonly services: Map<string, Service> = new Map(),
  ) {}
}

// automations

export interface Procedure {
  (context: ProcedureContext): Promise<unknown>;
}

export interface ProcedureContext {
  readonly system: System;
  readonly service: Service;
  readonly action: string;
  readonly request: Record<string, unknown>;
}

export interface Service {
  // execute(action: string, context: ): Promise<unknown>;
  items(): Promise<Item[]>;
}

export interface Item {
  schema: Record<string, string>;
}
