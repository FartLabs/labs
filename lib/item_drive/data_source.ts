export interface DataSource {
  insertFact(fact: Fact): Promise<void>;
  insertFacts(facts: Fact[]): Promise<void>;
  fetchFacts(query: FactQuery): Promise<Fact[]>;
  fetchFact(factID: string): Promise<Fact>;
}

export interface Fact {
  readonly factID: string;
  readonly itemID: string;
  readonly attribute: string;
  readonly value: string;
  readonly numericalValue?: number;
  readonly type: string;
  readonly flags: number;
  readonly timestamp: Date;
}

interface InsertedFact {
  factID?: string;
  itemID?: string;
  attribute?: string;
  value?: string;
  numericalValue?: number;
  type?: string;
  flags?: number;
  timestamp?: Date;
}

interface FactQuery {
  itemID?: string;
  attribute?: string;
  value?: string;
  valueAtOrAbove?: number;
  valueAtOrBelow?: number;
  createdAtOrAfter?: Date;
  createdAtOrBefore?: Date;
}
