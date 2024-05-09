export class System<TSchema extends SystemSchema> // T extends { [service: string]: { [action: string]: [unknown, unknown] } },
{
  constructor(
    private readonly services: ServicesMap<TSchema> = new Map(),
  ) {}

  /**
   * execute executes an action on a service in the system.
   */
  public execute<
    TService extends keyof TSchema,
    TAction extends keyof TSchema[TService],
  >(
    serviceName: TService,
    actionName: TAction,
    request: RequestOf<TSchema, TService, TAction>,
  ): ResponseOf<TSchema, TService, TAction> {
    const service = this.services.get(String(serviceName));
    if (!service) {
      throw new Error(`Service not found: ${String(serviceName)}`);
    }

    return service.execute({
      system: this,
      serviceName,
      service,
      actionName,
      request,
    });
  }

  /**
   * from creates a new system from a list of services.
   */
  static from<TSchema extends SystemSchema>(
    services: ServicesRouter<TSchema>,
  ): System<TSchema> {
    return new System(new Map(Object.entries(services)));
  }
}

/**
 * ServicesMap is a map of service names to services.
 */
export type ServicesMap<TSchema extends SystemSchema> = Map<
  string,
  Service<TSchema>
>;

/**
 * ServicesRouter is a map of service names to services.
 */
export type ServicesRouter<TSchema extends SystemSchema> = {
  [serviceName in keyof TSchema]: {
    [actionName in keyof TSchema[serviceName]]: ActionOf<
      TSchema,
      serviceName,
      actionName
    >;
  };
};

/**
 * SystemSchema is the schema of a system.
 */
export type SystemSchema = Record<string, Record<string, [unknown, unknown]>>;

/**
 * Action is a function that executes a service action.
 */
// export type Action<TRequest, TResponse> = (
//   ctx: ActionContext<TRequest>,
// ) => TResponse;

/**
 * ActionOf is the type of an action from a service in a system.
 */
export type ActionOf<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
  TAction extends keyof TSchema[TService],
> = (
  ctx: ActionContextOf<TSchema, TService, TAction>,
) => ResponseOf<TSchema, TService, TAction>;

/**
 * Service executes actions.
 */
export interface Service<TSchema extends SystemSchema> {
  execute<
    TService extends keyof TSchema,
    TAction extends keyof TSchema[TService],
  >(
    ctx: ActionContextOf<TSchema, TService, TAction>,
  ): ResponseOf<TSchema, TService, TAction>;
}

/**
 * ActionInput is the input to execute an action at the system level.
 */
export interface ActionInput<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
  TAction extends keyof TSchema[TService],
> {
  readonly serviceName: TService;
  readonly actionName: TAction;
  readonly request: RequestOf<TSchema, TService, TAction>;
}

export type RequestOf<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
  TAction extends keyof TSchema[TService],
> = ActionSchemaOf<TSchema, TService, TAction>[0];

export type ResponseOf<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
  TAction extends keyof TSchema[TService],
> = ActionSchemaOf<TSchema, TService, TAction>[1];

export type ActionSchemaOf<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
  TAction extends keyof TSchema[TService],
> = TSchema[TService][TAction];

/**
 * ActionContext is the context passed to a service action.
 */
export interface ActionContextOf<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
  TAction extends keyof TSchema[TService],
> extends ActionInput<TSchema, TService, TAction> {
  readonly system: System<TSchema>;
  readonly service: Service<TSchema>;
}

// export interface Item {
//   schema: Record<string, string>;
// }
