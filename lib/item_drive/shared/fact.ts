export interface Fact extends TypedValue {
  factID: string;
  itemID: string;
  attribute: string;
  timestamp: Date;
  discarded: boolean;
}
