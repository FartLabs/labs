import { ActionContext, Service, ServiceSchemaOf } from "./system.ts";

export const randomService = new Service({ pick });

export function pick(ctx: ActionContext<{ from: string[] }>): string {
  return ctx.request.from[Math.floor(Math.random() * ctx.request.from.length)];
}

export function emoji(
  ctx: ActionContext<
    never,
    { randomService: { pick: typeof pick } }
  >,
): string {
  return `👋 ${
    ctx.services.randomService.execute(
      "pick",
      { request: { from: ["world"] } },
    )
  }!`;
}

export const greetingService = new Service({ greet });

export function greet(
  ctx: ActionContext<
    { message: string },
    { randomService: ServiceSchemaOf<typeof randomService> }
  >,
): string {
  return `Hello, ${ctx.request.message}!`;
}

if (import.meta.main) {
  const result = greetingService.execute(
    "greet",
    { request: { message: "world" } },
  );
  console.log(result);
}
