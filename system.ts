export type ServiceSchemaOf<TService> = TService extends Service<infer TSchema>
  ? TSchema
  : never;

export class Service<TSchema extends ServiceSchema> {
  public constructor(
    private readonly actions: TSchema,
  ) {}

  public execute<TAction extends keyof TSchema>(
    actionName: TAction,
    ctx: Parameters<TSchema[TAction]>[0],
  ): ReturnType<TSchema[TAction]> {
    return this.actions[actionName](ctx);
  }
}

export interface SystemSchema {
  [serviceName: string]: ServiceSchema;
}

export interface ServiceSchema {
  // deno-lint-ignore no-explicit-any
  [actionName: string]: Action<any, any>;
}

export interface Action<TContext, TResponse> {
  (ctx: TContext): TResponse;
}

// export interface ServiceActionContext<
//   TRequest,
//   TService extends typeof Service,
// > extends ActionContext<TRequest> {
//   service: TService;
// }

export type ActionContext<
  TRequest = never,
  TSchema extends SystemSchema = never,
> =
  & { request: TRequest }
  & {
    services: { [serviceName in keyof TSchema]: Service<TSchema[serviceName]> };
  };

// & (TSchema extends never ? {} : {
//   services: { [serviceName in keyof TSchema]: Service<TSchema[serviceName]> };
// });
