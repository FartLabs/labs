import { ensureFileSync, existsSync } from "@std/fs";
import { DataSource } from "./data_source.ts";

export class FSDataSource implements DataSource {
  public constructor(
    private readonly path = jsonPath,
    private readonly encode = makeJSONEncoder<unknown>(),
    private readonly decode = makeJSONDecoder<unknown>(),
  ) {}

  public getItem<TType extends string, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    if (!this.decode) {
      throw new Error("Unexpected call to getItem without decode");
    }

    return readItem(this.path, name, type, this.decode) as TItem | undefined;
  }

  public getItems<TType extends string, TItem>(
    type: TType,
  ): Array<[string, TItem]> {
    const dir = this.path(type);
    if (existsSync(dir, { isReadable: true, isDirectory: true })) {
      return [];
    }

    return Array.from(Deno.readDirSync(dir), (entry) => {
      const item = this.getItem<TType, TItem>(type, entry.name);
      if (item === undefined) {
        throw new Error(`Failed to read item ${entry.name} of type ${type}`);
      }

      return [entry.name, item];
    });
  }

  public setItem<TType extends string, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    if (!this.encode) {
      throw new Error("Unexpected call to setItem without encode");
    }

    writeItem(this.path, item, name, type, this.encode);
  }

  public setItems<TType extends string, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    for (const [name, item] of items) {
      this.setItem(type, name, item);
    }
  }

  public deleteItem<TType extends string>(
    type: TType,
    name: string,
  ): void {
    Deno.removeSync(this.path(type, name));
  }

  public deleteItems<TType extends string>(type: TType): void {
    Deno.removeSync(this.path(type));
  }
}

export function jsonPathFromPrefix(prefix: string) {
  return (type: string, name?: string) => `${prefix}${jsonPath(type, name)}`;
}

export function jsonPath(type: string, name?: string) {
  return `${type}${name ? `/${name}.json` : ""}`;
}

export function makeJSONDecoder<T>(): ItemDecoder<T> {
  return { text: (text: string) => JSON.parse(text) as T };
}

export function makeJSONEncoder<T>(): ItemEncoder<T> {
  return { text: (item: T) => JSON.stringify(item, null, 2) + "\n" };
}

export function readItem<T = unknown>(
  path: ItemPath,
  name: string,
  type: string,
  decode: ItemDecoder<T>,
): T | undefined {
  const file = path(type, name);
  if (!existsSync(file, { isReadable: true, isFile: true })) {
    return undefined;
  }

  if ("text" in decode) {
    const text = Deno.readTextFileSync(file);
    return decode.text(text, name, type);
  }

  const data = Deno.readFileSync(file);
  return decode.binary(data, name, type);
}

export type ItemDecoder<T = unknown> =
  | { text: (text: string, name: string, type: string) => T }
  | { binary: (data: Uint8Array, name: string, type: string) => T };

export function writeItem<T = unknown>(
  path: ItemPath,
  item: T,
  name: string,
  type: string,
  encode: ItemEncoder<T>,
) {
  const file = path(type, name);
  ensureFileSync(file);
  if ("text" in encode) {
    const text = encode.text(item, name, type);
    Deno.writeTextFileSync(file, text);
    return;
  }

  const data = encode.binary(item, name, type);
  Deno.writeFileSync(file, data);
}

export type ItemEncoder<T = unknown> =
  | { text: (item: T, name: string, type: string) => string }
  | { binary: (item: T, name: string, type: string) => Uint8Array };

export type ItemPath = (type: string, name?: string) => URL | string;
