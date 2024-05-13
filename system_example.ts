// import { parseArgs } from "@std/cli";
import type { Context, ServiceAction, ServiceActionOf } from "./system.ts";

interface CLIOptions<
  TContext extends Context,
  TAction extends keyof TContext,
> {
  command?: TAction;
  subcommands?: TAction[];
  parseArgs: {
    [actionName in TAction]: (
      args: string[],
    ) =>
      | Parameters<TContext[actionName]>[0]
      | Promise<Parameters<TContext[actionName]>[0]>;
  };
  handleResponse: {
    [actionName in TAction]: (
      response: ReturnType<TContext[actionName]>,
    ) => void | Promise<void>;
  };
}

function makeCLI<TContext extends Context, TAction extends keyof TContext>(
  service: TContext,
  options: CLIOptions<TContext, TAction>,
) {
  return async (args: string[]) => {
    const arg0 = args[0] as TAction;
    const isSubcommand = options.subcommands?.includes(arg0) ?? false;
    if (!isSubcommand && !options.command) {
      throw new Error(`Unknown command: ${String(arg0)}`);
    }

    const actionName = isSubcommand ? arg0 : options.command;
    if (!actionName) {
      throw new Error("No action specified");
    }

    const action = service[actionName];
    if (!action) {
      throw new Error(`Unknown action: ${String(actionName)}`);
    }

    const cliCommand = makeCLICommand(
      action,
      options.parseArgs[actionName],
    );
    const result = await cliCommand(args.slice(!isSubcommand ? 0 : 1));
    await options.handleResponse[actionName](result);
  };
}

function makeCLICommand<TServiceAction extends ServiceAction>(
  action: TServiceAction,
  parseArgs: (args: string[]) => Parameters<TServiceAction>[0],
) {
  return async (args: string[]) => await action(parseArgs(args));
}

class GreetingService {
  public constructor(
    private readonly randomLetter: RandomLetterServiceAction,
  ) {}

  public greet(request: { name: string }) {
    return greet(request, { randomLetter: this.randomLetter });
  }
}

// This type is conventionally exported with its action implementation
// so that it can be used in other services. This doubles as a type checking
// mechanism for the action implementation.
export type GreetServiceAction = ServiceActionOf<typeof greet>;

function greet(
  request: { name: string },
  ctx: { randomLetter: RandomLetterServiceAction },
): string {
  return `Hello, ${request.name}! Your random letter: '${ctx.randomLetter()}'!`;
}

class RandomService {
  public pick(request: { from: string }) {
    return pickString(request);
  }

  public randomLetter() {
    return randomLetter(undefined, { pick: this.pick });
  }
}

type RandomLetterServiceAction = ServiceActionOf<typeof randomLetter>;

function randomLetter(_: void, ctx: { pick: PickStringServiceAction }): string {
  return ctx.pick({ from: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
}

type PickStringServiceAction = ServiceActionOf<typeof pickString>;

function pickString(request: { from: string }): string {
  return request.from[Math.floor(Math.random() * request.from.length)];
}

type Test = keyof GreetingService;

if (import.meta.main) {
  const randomService = new RandomService();
  const greetingService = new GreetingService(
    randomService.randomLetter.bind(randomService),
  );

  // Argument of type 'GreetingService' is not assignable to parameter of type 'Context'.
  // Index signature for type 'string' is missing in type 'GreetingService'.deno-ts(2345)
  const cli = makeCLI(greetingService, {});
  await cli(Deno.args);

  // const result = greetingService.greet({ name: "World" });
  // console.log(result);
}
