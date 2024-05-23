import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * VectorService manages N-dimensional vectors.
 */
export class VectorService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ vector: Vector }>,
  ) {}

  public plot(props: { name: string; vector: Vector }) {
    this.itemDrive.setItem("vector", props.name, {
      dimension: props.vector.dimension,
      value: props.vector.value,
    });
  }
}

/**
 * Vector is a vector in N-dimensional space.
 */
export interface Vector {
  /**
   * The dimension of the vector.
   */
  readonly dimension: number;

  /**
   * The value of the vector.
   */
  readonly value: number[];
}
