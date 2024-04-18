/**
 * Variable is a named value in a lab.
 */
export type Variable<TName extends string, TValue> = Record<TName, TValue>;

/**
 * Procedure is a callable variable in a lab.
 */
export interface Procedure<TRequest, TResponse> {
  (props: TRequest): TResponse;
}

/**
 * Lab is a collection of resources that can be used together to perform tasks.
 */
export class Lab<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
> {
  #variables = new Map<string, unknown>();
  #procedures = new Set<string>();

  public [Symbol.iterator](): IterableIterator<[string, unknown]> {
    return this.#variables.entries();
  }

  /**
   * variable sets a variable in the lab.
   */
  public variable<TName extends string, TValue>(
    name: TName,
    value: TValue,
  ): Lab<T & Variable<TName, TValue>> {
    this.#variables.set(name, value);
    return this as Lab<T & Variable<TName, TValue>>;
  }

  /**
   * get returns a variable from the lab.
   */
  public get<TName extends keyof T>(
    name: TName,
  ): T[TName] {
    const value = this.#variables.get(name as string) as
      | T[TName]
      | undefined;
    if (value === undefined) {
      throw new Error(`No such resource: ${String(name)}`);
    }

    return value;
  }

  /**
   * extends extends the lab with the variables and procedures from another lab.
   */
  public extend<U extends Record<PropertyKey, unknown>>(
    lab: Lab<U>,
  ): Lab<T & U> {
    for (const [name, value] of lab) {
      this.#variables.set(name, value);
    }

    for (const name of lab.#procedures) {
      this.#procedures.add(name);
    }

    return this as Lab<T & U>;
  }

  /**
   * satisfies fails type-check if the lab does implement the required variables.
   */
  public satisfies<
    U extends T extends U ? Record<PropertyKey, unknown> : never,
  >(_: Lab<U>): Lab<T> {
    return this;
  }

  /**
   * deepCopy creates a new lab with the same variables.
   */
  public deepCopy(): Lab<T> {
    const lab = new Lab();
    for (const [name, value] of this) {
      if (this.#procedures.has(name)) {
        lab.#procedures.add(name);
      }

      lab.variable(name, value);
    }

    return lab as Lab<T>;
  }

  /**
   * procedure sets an executable variable in the lab.
   */
  public procedure<
    TName extends string,
    TDependency extends string,
    TRequest,
    TResponse,
  >(
    name: TName,
    execute: (
      props: TRequest,
      dependencies: { [K in TDependency]: T[K] },
    ) => TResponse,
    dependencyNames?: TDependency[],
    // TODO: Consider replacing arguments with a single object argument.
  ): Lab<T & Variable<TName, Procedure<TRequest, TResponse>>> {
    const procedure = (props: TRequest) => {
      const dependencies = (dependencyNames ?? [])
        .reduce(
          (acc, key) => {
            acc[key] = this.get(key);
            return acc;
          },
          {} as { [K in TDependency]: T[K] },
        );

      return execute(props, dependencies);
    };

    this.#procedures.add(name);
    return this.variable(name, procedure);
  }

  /**
   * execute executes a callable variable in the lab.
   */
  public execute<
    TName extends keyof T,
    TValue extends T[TName],
    TRequest extends // deno-lint-ignore no-explicit-any
    (TValue extends (...args: any) => any ? Parameters<TValue>[0]
      : never),
    TResponse extends // deno-lint-ignore no-explicit-any
    (TValue extends (...args: any) => any ? ReturnType<TValue>
      : never),
  >(name: TName, request: TRequest): TResponse {
    const procedure = this.get(name);
    if (!procedure) {
      throw new Error(`No such resource: ${String(name)}`);
    }

    if (!this.#procedures.has(name as string)) {
      throw new Error(`Resource is not a procedure: ${String(name)}`);
    }

    if (typeof procedure !== "function") {
      throw new Error(`Unexpected resource type: ${String(name)}`);
    }

    return procedure(request);
  }
}
