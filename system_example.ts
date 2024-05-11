function createService<T extends Record<string, Action>>(
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

export type ServiceActionOf<T extends Action> = Parameters<T>[0] extends never
  ? () => ReturnType<T>
  : (request: Parameters<T>[0]) => ReturnType<T>;

export type Action = (request: any, ctx: Context) => any;

// export type Action<T extends ServiceSchema> = (request: any, ctx: ) => any;

export type Context = Record<string, ServiceAction>;

export type ServiceAction = (request: any) => any;

type EmojiServiceAction = ServiceActionOf<typeof emoji>;

function greet(
  request: { message: string },
  ctx: { emoji: EmojiServiceAction },
): string {
  return `Hello, ${request.message}! ${ctx.emoji()}`;
}

function pick(request: { from: string[] }): string {
  return request.from[Math.floor(Math.random() * request.from.length)];
}

// TODO: Consider moving the request into the context to avoid confusion
// with multiple parameters.
function emoji(_: never, ctx: { pick: typeof pick }): string {
  return ctx.pick({ from: ["🌍", "🌎", "🌏"] });
}

if (import.meta.main) {
  const randomService = createService({ pick, emoji });
  const greetingService = createService(
    { greet },
    { emoji: randomService.emoji },
  );
  const result = greetingService.greet({ message: "world" });
  console.log(result);
}
