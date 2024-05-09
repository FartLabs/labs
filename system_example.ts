// import type { ActionContext } from "./system.ts";
import { System } from "./system.ts";

if (import.meta.main) {
  const system = System.from({
    greeting: {
      // Type '(ctx: ActionContextOf<SystemSchema, "greeting", "greet">) => string' is not assignable to type 'ActionOf<SystemSchema, string, string>'.
      greet(ctx): string {
        return `Hello, ${ctx.request}!`;
      },
    },
    // items: {
    //   execute<TIn, TOut>(ctx: ActionContext<TIn>): TOut {
    //     switch (ctx.actionName) {
    //       case "get": {
    //         return ctx.request as unknown as TOut;
    //       }

    //       case "set": {
    //         return ctx.request as unknown as TOut;
    //       }

    //       default: {
    //         throw new Error(`Action not found: ${ctx.actionName}`);
    //       }
    //     }
    //   },
    // },
  });

  const result = system.execute("items", "get", "hello");
  console.log(result);
}
