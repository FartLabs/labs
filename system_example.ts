function createService<TSchema extends ServiceSchema>(
  actions: TSchema,
  ctx: Context = {},
  // ctx: ContextOf<TSchema> = {} as ContextOf<TSchema>,
): Service<TSchema> {
  const service = Object.fromEntries(
    Object.entries(actions).map(([actionName, action]) => [
      actionName,
      (request: Parameters<typeof action>[0]) =>
        action(request, { ...service, ...ctx }),
    ]),
  ) as Service<TSchema>;

  return service;
}

// export type ContextOf<TSchema extends ServiceSchema> = {
//   [actionName in keyof ContextSchemaOf<TSchema>]: ServiceActionOf<
//     TSchema[ContextSchemaOf<TSchema>[actionName]]
//   >;
// };

// export type ContextSchemaOf<TSchema extends ServiceSchema> = {
//   [actionName in keyof TSchema]: TSchema[actionName] extends Action
//     ? Parameters<TSchema[actionName]>[1]
//     : never;
// };

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
  request: { message: string },
  ctx: { randomFruit: RandomFruitServiceAction },
): string {
  return `Hello, ${request.message}! ${ctx.randomFruit()}`;
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

if (import.meta.main) {
  const randomService = createService({ randomFruit, pick });
  const greetingService = createService(
    { greet },
    { randomFruit: randomService.randomFruit },
  );
  const result = greetingService.greet({ message: "world" });
  console.log(result);
}
