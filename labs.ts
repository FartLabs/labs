/**
 * Variable is a named value in a lab.
 */
export type Variable<TName extends string, TValue> = Record<TName, TValue>;

/**
 * Lab is a collection of resources that can be used together to perform tasks.
 */
export class Lab<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
> {
  #variables = new Map<string, unknown>();

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
   * clone creates a new lab with the same variables.
   */
  public clone(): Lab<T> {
    const lab = new Lab<T>();
    lab.#variables = new Map(this.#variables);
    return lab;
  }
}
