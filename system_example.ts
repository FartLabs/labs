interface Item {
  type: string;
}

// Do I need to define type schemas for the items? Maybe use ts-morph to describe services in code?
// Where are the items stored?

// Items service aka the item drive is responsible for managing item storage.
class ItemsService {
  constructor(private readonly storage: Map<string, Item>) {}

  public set(request: { type: string; item: Item }): void {
    this.storage.set(request.type, request.item);
  }

  public get(request: { type: string }): Item {
    const item = this.storage.get(request.type);
    if (item === undefined) {
      throw new Error(`Item not found: ${request.type}`);
    }

    return item;
  }

  public list(): Item[] {
    return Array.from(this.storage.values());
  }
}

class RandomService {
  public pick(request: { from: string[] }): string {
    return request.from[Math.floor(Math.random() * request.from.length)];
  }

  public emoji(): string {
    return this.pick({ from: ["🌍", "🌎", "🌏"] });
  }
}

// class GreetingService {
//   public constructor(private readonly randomService: RandomService) {}

//   public greet(request: { message: string }): string {
//     return `Hello, ${request.message}! ${this.randomService.emoji()}`;
//   }
// }

class GreetingService {
  public constructor(private readonly randomService: RandomService) {}

  public greet(request: { message: string }): string {
    return greet(
      request,
      { emoji: this.randomService.emoji.bind(this.randomService) },
    );
  }
}

function greet(
  request: { message: string },
  { emoji }: { emoji: RandomService["emoji"] },
): string {
  return `Hello, ${request.message}! ${emoji()}`;
}

if (import.meta.main) {
  const greetingService = new GreetingService(new RandomService());
  const result = greetingService.greet({ message: "world" });
  console.log(result);
}
