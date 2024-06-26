import type {
  DataSourceInterface,
  Fact,
  FactQuery,
  PartialFact,
} from "./shared/mod.ts";
import { checkFact, makeFact } from "./shared/mod.ts";

export class InMemoryDataSource implements DataSourceInterface {
  public constructor(
    public factsByItemID: Map<string, Map<string, Fact>> = new Map(),
    public itemIDByFactID: Map<string, string> = new Map(),
  ) {}

  public insertFact(partialFact: PartialFact): Promise<Fact> {
    const fact = makeFact(partialFact);
    const allFacts = this.factsByItemID.get(fact.itemID) ?? new Map();
    this.factsByItemID.set(fact.itemID, allFacts.set(fact.factID, fact));
    this.itemIDByFactID.set(fact.factID, fact.itemID);
    return Promise.resolve(fact);
  }

  public async insertFacts(facts: PartialFact[]): Promise<Fact[]> {
    const timestamp = (new Date()).getTime();
    return await Promise.all(facts.map((fact) =>
      this.insertFact({
        ...fact,
        timestamp: fact.timestamp ?? timestamp,
      })
    ));
  }

  public async fetchFacts(query: FactQuery): Promise<Fact[]> {
    if (query.itemID === undefined) {
      return (await Promise.all(
        Array.from(this.factsByItemID.keys()).map((itemID) =>
          this.fetchFacts({ ...query, itemID: [itemID] })
        ),
      )).flat();
    }

    const factsFromItemID = query.itemID.flatMap((itemID) =>
      Array.from(this.factsByItemID.get(itemID)?.values() ?? [])
        .filter((fact) => checkFact(fact, query))
    );
    const factsFromFactID = (await Promise.all(
      query.factID?.map((factID) => this.fetchFact(factID)) ?? [],
    )).filter((fact) => checkFact(fact, query));
    return factsFromItemID.concat(factsFromFactID);
  }

  public fetchFact(factID: string): Promise<Fact> {
    const itemID = this.itemIDByFactID.get(factID);
    if (itemID === undefined) {
      throw new Error(`Fact not found: ${factID}`);
    }

    const facts = this.factsByItemID.get(itemID);
    if (facts === undefined) {
      throw new Error(`Item not found: ${itemID}`);
    }

    const fact = facts.get(factID);
    if (fact === undefined) {
      throw new Error(`Fact not found: ${factID}`);
    }

    return Promise.resolve(fact);
  }
}
