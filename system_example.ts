import type { ContextOmitService, ServiceActionOf } from "./system.ts";
import { createService } from "./system.ts";

function greet(
  request: { name: string },
  ctx: { randomLetter: RandomLetterServiceAction },
): string {
  return `Hello, ${request.name}! Your random letter: '${ctx.randomLetter()}'!`;
}

// Want: type Test = { pick: PickStringServiceAction }
// Have: type Test = {}
export type Test = ContextOmitService<{
  pickString: typeof pickString;
  randomLetter: typeof randomLetter;
}>;

const randomService = createService(
  { randomLetter, pickString },
  { shouldnt: "be here" },
);

type RandomLetterServiceAction = ServiceActionOf<typeof randomLetter>;

function randomLetter(_: void, ctx: { pick: PickStringServiceAction }): string {
  return ctx.pick({ from: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
}

type PickStringServiceAction = ServiceActionOf<typeof pickString>;

function pickString(request: { from: string }): string {
  return request.from[Math.floor(Math.random() * request.from.length)];
}

if (import.meta.main) {
  const greetingService = createService({ greet }, randomService);
  const result = greetingService.greet({ name: "World" });
  console.log(result);
}
