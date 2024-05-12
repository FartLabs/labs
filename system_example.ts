import type { RequestType, ServiceActionOf } from "./system.ts";
import { createService } from "./system.ts";

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
