export class System<TSchema extends SystemSchema> {
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
  static from<TRouter extends ServicesRouter<any>>(
    services: TRouter,
  ): System<SchemaOf<TRouter>> {
    return new System(
      new Map(
        Object.entries(services)
          .map(([name, actions]) => [name, routerService(actions)]),
      ),
    );
  }
}

export type SchemaOf<TRouter extends ServicesRouter<SystemSchema>> =
  TRouter extends ServicesRouter<infer TSchema> ? TSchema : never;

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
  [serviceName in keyof TSchema]: ActionsRouter<TSchema, serviceName>;
};

/**
 * ActionsRouter is a map of action names to actions.
 */
export type ActionsRouter<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
> = {
  [actionName in keyof TSchema[TService]]: Action<
    RequestOf<TSchema, TService, actionName>,
    ResponseOf<TSchema, TService, actionName>
  >;
};

// /**
//  * ServicesRouter is a map of service names to services.
//  */
// export type ServicesRouter<TSchema extends SystemSchema> = {
//   [serviceName in keyof TSchema]: {
//     [actionName in keyof TSchema[serviceName]]: ActionOf<
//       TSchema,
//       serviceName,
//       actionName
//     >;
//   };
// };

/**
 * SystemSchema is the schema of a system.
 */
export interface SystemSchema {
  [serviceName: string]: ServiceSchema;
}

/**
 * ServiceSchema is the schema of a service.
 */
export interface ServiceSchema {
  [actionName: string]: [unknown, unknown];
}

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
  // TODO: Figure out how to pass generic request/response types when defining the action.
  ctx: ActionContextOf<TSchema, TService, TAction>,
) => ResponseOf<TSchema, TService, TAction>;

/**
 * Action is a function that executes a service action in a system.
 */
export interface Action<TRequest, TResponse> {
  (ctx: ActionContext<TRequest>): TResponse;
}

/**
 * routerService makes a service from an actions router.
 */
export function routerService<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
>(router: ActionsRouter<TSchema, TService>): Service<TSchema> {
  return {
    execute<TService_ extends TService, TAction_ extends TSchema[TService_]>(
      ctx: ActionContextOf<TSchema, TService_, TAction_>,
    ): ResponseOf<TSchema, TService, TAction> {
      const actionName = String(ctx.actionName);
      const action = router[actionName];
      if (action === undefined) {
        throw new Error(`Action not found: ${actionName}`);
      }

      return action(ctx as ActionContext<any>);
    },
  };
}

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
> extends ActionInputOf<TSchema, TService, TAction> {
  readonly system: System<TSchema>;
  readonly service: Service<TSchema>;
}

/**
 * ActionInput is the input to execute an action at the system level.
 */
export interface ActionInputOf<
  TSchema extends SystemSchema,
  TService extends keyof TSchema,
  TAction extends keyof TSchema[TService],
> {
  readonly serviceName: TService;
  readonly actionName: TAction;
  readonly request: RequestOf<TSchema, TService, TAction>;
}

// /**
//  * ActionInput is the input to execute an action at the system level.
//  */
// export interface ActionInput<
//   TSchema extends SystemSchema,
//   TService extends keyof TSchema,
//   TAction extends keyof TSchema[TService],
//   TRequest extends RequestOf<TSchema, TService, TAction> = RequestOf<
//     TSchema,
//     TService,
//     TAction
//   >,
// > {
//   readonly serviceName: TService;
//   readonly actionName: TAction;
//   readonly request: TRequest;
// }

/**
 * ActionInput is the input to execute an action at the system level.
 */
export interface ActionInput<TRequest> {
  readonly serviceName: string;
  readonly actionName: string;
  readonly request: TRequest;
}

/**
 * ActionContext is the context passed to a service action.
 */
export interface ActionContext<TRequest> extends ActionInput<TRequest> {
  readonly system: System<any>;
  readonly service: Service<any>;
}

// /**
//  * ActionContext is the context passed to a service action.
//  */
// export interface ActionContextOf<
//   TSchema extends SystemSchema,
//   TService extends keyof TSchema,
//   TAction extends keyof TSchema[TService],
//   TRequest extends RequestOf<TSchema, TService, TAction> = RequestOf<
//     TSchema,
//     TService,
//     TAction
//   >,
// > extends ActionInput<TSchema, TService, TAction, TRequest> {
//   readonly system: System<TSchema>;
//   readonly service: Service<TSchema>;
// }

// export interface Item {
//   schema: Record<string, string>;
// }
