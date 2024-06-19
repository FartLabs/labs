import { TypedValueType } from "./typed_value.ts";

export interface Fact {
  factID: string;
  itemID: string;
  attribute: string;
  value: string;
  numericalValue?: number;
  type: TypedValueType;
  flags: number;
  timestamp: Date;
}
