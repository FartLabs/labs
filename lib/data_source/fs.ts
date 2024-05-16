import { DataSource } from "./data_source.ts";

export class FSDataSource implements DataSource {
  public constructor(
    private readonly path: (type: string, name?: string) => string,
    private readonly encode?: ItemEncoder<unknown>,
    private readonly decode?: ItemDecoder<unknown>,
  ) {}

  public get mode() {
    return {
      read: this.decode !== undefined,
      write: this.encode !== undefined,
    };
  }

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
    _type: TType,
  ): Array<[string, TItem]> {
    throw new Error("Not implemented");
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

export function readItem<T = unknown>(
  path: ItemPath,
  name: string,
  type: string,
  decode: ItemDecoder<T>,
): T | undefined {
  const file = path(type, name);
  if (!Deno.statSync(file).isFile) {
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
  const dir = path(type);
  Deno.mkdirSync(dir, { recursive: true });

  const file = path(type, name);
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
