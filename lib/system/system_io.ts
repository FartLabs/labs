export class SystemIO<TInput, TOutput> {
  public constructor(
    public readonly eventHandler: SystemEventHandler<TInput, TOutput>,
    public readonly outputHandler: SystemOutputHandler<TOutput>,
  ) {}

  public async handle(event: TInput): Promise<void> {
    const output = await this.eventHandler(event);
    await this.outputHandler(output);
  }
}

export interface SystemOutputHandler<TOutput> {
  (output: TOutput): Promise<void>;
}

export interface SystemEventHandler<TInput, TOutput> {
  (event: TInput): Promise<TOutput>;
}

export type SystemEvent = unknown;

export type SystemOutput = unknown;

class SystemAdapter {
  onEvent(event: SystemEvent): Promise<SystemOutput> {}
  onOutput(output: SystemOutput): Promise<void> {}
}
