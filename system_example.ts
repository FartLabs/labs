import { ActionContext, Service } from "./system.ts";

export function greet(
  ctx: ActionContext<{ message: string }>,
): string {
  return `Hello, ${ctx.request.message}!`;
}

if (import.meta.main) {
  const service = new Service({ greet });
  const result = service.execute(
    "greet",
    { request: { message: "world" } },
  );
  console.log(result);
}
