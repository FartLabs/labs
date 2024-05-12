import type { ServiceActionOf } from "./system.ts";
import { createService } from "./system.ts";

function greet(
  request: { name: string },
  ctx: typeof randomService,
): string {
  return `Hello, ${request.name}! Your random letter: '${ctx.randomLetter()}'!`;
}

const randomService = createService({ randomLetter, pickString });

function randomLetter(
  _: void,
  ctx: { pickString: PickStringServiceAction },
): string {
  return ctx.pickString({ from: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
}

type PickStringServiceAction = ServiceActionOf<typeof pickString>;

function pickString(request: { from: string }): string {
  return request.from[Math.floor(Math.random() * request.from.length)];
}

if (import.meta.main) {
  const greetingService = createService(
    { greet },
    randomService,
  );
  const result = greetingService.greet({ name: "World" });
  console.log(result);
}
