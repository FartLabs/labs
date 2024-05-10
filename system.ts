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

export interface ServiceSchema {
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

export interface ActionContext<TRequest> {
  request: TRequest;
}
