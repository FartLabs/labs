// import type { ActionContext } from "./system.ts";
import { ActionContext, System } from "./system.ts";

if (import.meta.main) {
  const router = {
    greeting: {
      greet(ctx: ActionContext<string>) {
        return `Hello, ${ctx.request}!`;
      },
    },
  } as const;

  const system = System.from(router);

  const result = system.execute("items", "get", "hello");
  console.log(result);
}
