function createService<T extends ServiceSchema>(
  actions: T,
  ctx: Context = {},
): Service<T> {
  return Object.fromEntries(
    Object.entries(actions).map(([actionName, action]) => [
      actionName,
      (request: Parameters<typeof action>[0]) => action(request, ctx),
    ]),
  ) as Service<T>;
}

export type Service<T extends ServiceSchema> = {
  [actionName in keyof T]: ServiceActionOf<T[actionName]>;
};

export type ServiceSchema = Record<string, Action>;

export type ServiceActionOf<T extends Action> = Parameters<T>[0] extends
  RequestType.EMPTY ? () => ReturnType<T>
  : (request: Parameters<T>[0]) => ReturnType<T>;

export type Action = (request: any, ctx: Context) => any;

export type Context = Record<string, ServiceAction>;

export type ServiceAction = (request: any) => any;

export enum RequestType {
  EMPTY,
}

function greet(
  request: { message: string },
  ctx: {
    randomFruit: RandomFruitServiceAction;
    // pick: (request: { from: string[] }) => string;
  },
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
  // return pick({ from: "🍎🍊🍌🍉".split("") });
  return ctx.pick({ from: "🍎🍊🍌🍉".split("") });
}

if (import.meta.main) {
  const randomService = createService({ greet });
  const greetingService = createService(
    { greet },
    { emoji: randomService.emoji },
  );
  const result = greetingService.greet({ message: "world" });
  console.log(result);
}
