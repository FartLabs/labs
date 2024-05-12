/**
 * createService creates a service from a schema of actions.
 */
function createService<TSchema extends ServiceSchema>(
  actions: ContextOmitService<TSchema> extends Record<PropertyKey, unknown>
    ? TSchema
    : never,
): Service<TSchema>;
function createService<TSchema extends ServiceSchema>(
  actions: TSchema,
  ctx: ContextOmitService<TSchema>,
): Service<TSchema>;
function createService<TSchema extends ServiceSchema>(
  actions: TSchema,
  ctx?: ContextOmitService<TSchema>, // = {} as ContextOmitService<TSchema>,
): Service<TSchema> {
  const service = Object.fromEntries(
    Object.entries(actions).map(([actionName, action]) => [
      actionName,
      (request: Parameters<typeof action>[0]) =>
        action(request, { ...service, ...(ctx ?? {}) }),
    ]),
  ) as Service<TSchema>;

  return service;
}

// If action depends on action from local service and not external context
// then we can do this.

export type ContextWithService<TSchema extends ServiceSchema> =
  & ContextOf<TSchema>
  & Service<TSchema>;

export type ContextOmitService<TSchema extends ServiceSchema> = Omit<
  ContextOf<TSchema>,
  keyof TSchema
>;

export type ContextOf<TSchema extends ServiceSchema> = ContextSchemaOf<
  TSchema
>[keyof TSchema];

export type ContextSchemaOf<TSchema extends ServiceSchema> = {
  [actionName in keyof TSchema]: TSchema[actionName] extends Action
    ? Parameters<TSchema[actionName]>[1]
    : never;
};

export type Service<TSchema extends ServiceSchema> = {
  [actionName in keyof TSchema]: ServiceActionOf<TSchema[actionName]>;
};

export type ServiceSchema = Record<string, Action>;

export type ServiceActionOf<T extends Action> = Parameters<T>[0] extends
  RequestType.EMPTY ? () => ReturnType<T>
  : (request: Parameters<T>[0]) => ReturnType<T>;

// deno-lint-ignore no-explicit-any
export type Action = (request: any, ctx: any) => any;

export type Context = Record<string, ServiceAction>;

// deno-lint-ignore no-explicit-any
export type ServiceAction = (request: any) => any;

export enum RequestType {
  EMPTY,
}

function greet(
  request: { name: string },
  ctx: { randomFruit: RandomFruitServiceAction },
): string {
  return `Hello, ${request.name}! ${ctx.randomFruit()}`;
}

type PickServiceAction = ServiceActionOf<typeof pick>;

function pick(request: { from: string[] }): string {
  return request.from[Math.floor(Math.random() * request.from.length)];
}

type RandomFruitServiceAction = ServiceActionOf<typeof randomFruit>;

// TODO: Consider moving the request into the context to avoid confusion
// with multiple parameters.
function randomFruit(
  _: RequestType.EMPTY,
  ctx: { pick: PickServiceAction },
): string {
  return ctx.pick({ from: "🍎🍊🍌🍉".split("") });
}

type GreetContext = ContextOmitService<{ greet: typeof greet }>;

if (import.meta.main) {
  const randomService = createService({ randomFruit, pick });
  let result = randomService.randomFruit();
  console.log(result);

  const greetingService = createService(
    { greet },
    randomService,
  );
  result = greetingService.greet({ name: "world" });
  console.log(result);
}
