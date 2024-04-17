import type { Variable } from "./labs.ts";
import { Lab } from "./labs.ts";

/**
 * Procedure is a callable variable in a lab.
 */
export interface Procedure<TRequest, TResponse> {
  (props: TRequest): TResponse;
}

/**
 * ProcedureLab is a lab that supports procedures.
 */
export class ProcedureLab<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
> extends Lab<T> {
  #procedures = new Set<string>();

  /**
   * variable sets a variable in the lab.
   */
  public variable<TName extends string, TValue>(
    name: TName,
    value: TValue,
  ): ProcedureLab<T & Variable<TName, TValue>> {
    return super.variable(name, value) as ProcedureLab<
      T & Variable<TName, TValue>
    >;
  }

  /**
   * clone creates a new lab with the same variables.
   */
  public clone(): ProcedureLab<T> {
    const lab = new ProcedureLab();
    for (const [name, value] of this) {
      if (this.#procedures.has(name)) {
        lab.#procedures.add(name);
      }

      lab.variable(name, value);
    }

    return lab as ProcedureLab<T>;
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
  ): ProcedureLab<T & Variable<TName, Procedure<TRequest, TResponse>>> {
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
