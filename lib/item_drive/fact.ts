import { ValueType } from "./typed_value.ts";

export interface Fact {
  factID: string;
  itemID: string;
  attribute: string;
  value: string;
  numericalValue?: number;
  type: ValueType;
  flags: number;
  timestamp: Date;
}
