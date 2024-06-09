import { ensureFile, exists } from "@std/fs";
import { DataSource } from "./data_source.ts";

export class FSDataSource implements DataSource {
  public constructor(
    private readonly path = jsonPath,
    private readonly encode = makeJSONEncoder<unknown>(),
    private readonly decode = makeJSONDecoder<unknown>(),
  ) {}

  public async getItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
  ): Promise<TItem | undefined> {
    if (!this.decode) {
      throw new Error("Unexpected call to getItem without decode");
    }

    return await readItem<TItem>(
      this.path,
      name,
      collection,
      this.decode as ItemDecoder<TItem>,
    );
  }

  public async getItems<TCollection extends string, TItem>(
    collection: TCollection,
  ): Promise<Array<[string, TItem]>> {
    const dir = this.path(collection);
    if (await exists(dir, { isReadable: true, isDirectory: true })) {
      return [];
    }

    return Promise.all(
      await Array.fromAsync(
        Deno.readDir(dir),
        async (entry) => {
          const item = await this.getItem<TCollection, TItem>(
            collection,
            entry.name,
          );
          if (item === undefined) {
            throw new Error(
              `Failed to read item ${entry.name} of collection ${collection}`,
            );
          }

          return [entry.name, item];
        },
      ),
    );
  }

  public async setItem<TCollection extends string, TItem>(
    collection: TCollection,
    name: string,
    item: TItem,
  ) {
    if (!this.encode) {
      throw new Error("Unexpected call to setItem without encode");
    }

    await writeItem(this.path, item, name, collection, this.encode);
  }

  public async setItems<TCollection extends string, TItem>(
    collection: TCollection,
    items: Array<[string, TItem]>,
  ) {
    for (const [name, item] of items) {
      await this.setItem(collection, name, item);
    }
  }

  public async deleteItem<TCollection extends string>(
    collection: TCollection,
    name: string,
  ) {
    await Deno.remove(this.path(collection, name));
  }

  public async deleteItems<TCollection extends string>(
    collection: TCollection,
  ) {
    await Deno.remove(this.path(collection));
  }
}

export function jsonPathFromPrefix(prefix: string) {
  return (collection: string, name?: string) =>
    `${prefix}${jsonPath(collection, name)}`;
}

export function jsonPath(collection: string, name?: string) {
  return `${collection}${name ? `/${name}.json` : ""}`;
}

export function makeJSONDecoder<T>(): ItemDecoder<T> {
  return { text: (text: string) => JSON.parse(text) as T };
}

export function makeJSONEncoder<T>(): ItemEncoder<T> {
  return { text: (item: T) => JSON.stringify(item, null, 2) + "\n" };
}

export async function readItem<T = unknown>(
  path: ItemPath,
  name: string,
  collection: string,
  decode: ItemDecoder<T>,
): Promise<T | undefined> {
  const file = path(collection, name);
  if (!(await exists(file, { isReadable: true, isFile: true }))) {
    return undefined;
  }

  if ("text" in decode) {
    return decode.text(
      await Deno.readTextFile(file),
      name,
      collection,
    );
  }

  return decode.binary(await Deno.readFile(file), name, collection);
}

export type ItemDecoder<T = unknown> =
  | { text: (text: string, name: string, collection: string) => T }
  | { binary: (data: Uint8Array, name: string, collection: string) => T };

export async function writeItem<T = unknown>(
  path: ItemPath,
  item: T,
  name: string,
  collection: string,
  encode: ItemEncoder<T>,
) {
  const file = path(collection, name);
  await ensureFile(file);
  if ("text" in encode) {
    await Deno.writeTextFile(
      file,
      encode.text(item, name, collection),
    );
    return;
  }

  await Deno.writeFileSync(
    file,
    encode.binary(item, name, collection),
  );
}

export type ItemEncoder<T = unknown> =
  | { text: (item: T, name: string, collection: string) => string }
  | { binary: (item: T, name: string, collection: string) => Uint8Array };

export type ItemPath = (collection: string, name?: string) => URL | string;
