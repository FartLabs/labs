import { DataSource } from "./data_source.ts";

// FSDataSource file system data source storage stores items in the file system.
// basePath/
// ├── type1/
// │   ├── item1.json
// │   └── item2.json
// └── type2/
//     ├── item1.json
//     └── item2.json

export class FSDataSource implements DataSource {
  public constructor(
    private readonly path: (type: string, name?: string) => string,
    private readonly encode?:
      | { text: (item: unknown) => string }
      | { binary: (item: unknown) => Uint8Array },
    private readonly decode?:
      | { text: (text: string) => unknown }
      | { binary: (data: Uint8Array) => unknown },
  ) {}

  public get mode() {
    return {
      read: this.decode !== undefined,
      write: this.encode !== undefined,
    };
  }

  public getItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    return readItem(this.path(type, name), type, this.decode!);
  }

  public getItems<TType extends PropertyKey, TItem>(
    _type: TType,
  ): Array<[string, TItem]> {
    throw new Error("Not implemented");
  }

  public setItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    writeItem(this.path(type, name), item, type, this.encode!);
  }

  public setItems<TType extends PropertyKey, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    for (const [name, item] of items) {
      this.setItem(type, name, item);
    }
  }

  public deleteItem<TType extends PropertyKey>(
    type: TType,
    name: string,
  ): void {
    Deno.removeSync(this.path(type, name));
  }

  public deleteItems<TType extends PropertyKey>(type: TType): void {
    Deno.removeSync(this.path(type));
  }
}

export function readItem<T = unknown>(
  path: string,
  type: string,
  decode: Decoder<T>,
): T | undefined {
  if (!Deno.statSync(path).isFile) {
    return undefined;
  }

  if ("text" in decode) {
    const text = Deno.readTextFileSync(path);
    return decode.text(text, type);
  }

  const data = Deno.readFileSync(path);
  return decode.binary(data, type);
}

export type Decoder<T = unknown> =
  | { text: (text: string, type: string) => T }
  | { binary: (data: Uint8Array, type: string) => T };

export function writeItem<T = unknown>(
  path: string,
  item: T,
  type: string,
  encode: Encoder<T>,
) {
  if ("text" in encode) {
    const text = encode.text(item, type);
    Deno.writeTextFileSync(path, text);
    return;
  }

  const data = encode.binary(item, type);
  Deno.writeFileSync(path, data);
}

export type Encoder<T = unknown> =
  | { text: (item: T, type: string) => string }
  | { binary: (item: T, type: string) => Uint8Array };
