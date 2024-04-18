# Labs

[![GitHub Actions](https://github.com/FartLabs/labs/actions/workflows/check.yaml/badge.svg)](https://github.com/FartLabs/labs/actions/workflows/check.yaml)

🧪 Labs by [**@FartLabs**](https://github.com/FartLabs)

## Overview

A Lab is a data structure designed for composable and type-safe management of
variables and procedures.

Labs excel in promoting modularity and reusability. Small, well-defined Labs can
be composed to create complex data structures. This approach simplifies code
composition and improves code quality by reducing _redundancy_ and enhancing
_readability_. Additionally, this approach avoids the need for intricate
inheritance hierarchies with keywords like `super`, `this`, and `extends`.

### Concepts

- **Lab**: A container that holds a collection of named variables and functions
  (procedures).
- **Variable**: A named storage location within a Lab that holds a value.
- **Procedure**: A function defined within a Lab that performs a specific task
  and has type-safe access to variables and procedures within the same Lab.

### Benefits

By adopting Labs, developers can build applications with cleaner, more
maintainable, and reusable code.

- **Simplified composition**: Labs are easier to compose and work with compared
  to native classes. Accessing variables and procedures within a composed Lab is
  straightforward.
- **Improved code quality**: By encouraging the breakdown of complex data
  structures into smaller, modular Labs, code becomes:
  - **Maintainable**: Changes to a Lab's structure are localized and isolated,
    reducing the risk of unintended side effects.
  - **Less duplicated**: Shared functionalities can be encapsulated in reusable
    Labs, minimizing redundancy.
  - **More readable**: Clear separation of concerns improves code comprehension.
  - **Easier to reason about**: Smaller, well-defined Labs simplify code
    analysis and reasoning.

### Use cases

> [!NOTE]
>
> Example Labs demonstrating the following use cases will be added in the
> future.

- **State management**: Labs can be used to manage application state by
  encapsulating state variables and state-changing procedures within a Lab.
- **Data processing**: Labs can be used to encapsulate data processing logic,
  making it easier to manage and reuse.
- **API clients**: Labs can be used to encapsulate API clients, making it easier
  to manage API calls and responses.
- **Configuration management**: Labs can be used to manage application
  configuration by encapsulating configuration variables and procedures within a
  Lab.
- **Second brain**: Labs can be used to encapsulate knowledge and procedures
  that are useful for a specific domain or task.
- **Testing**: Labs can be used to encapsulate test data and test procedures,
  making it easier to manage and reuse test cases.
- **Miscellaneous**: Labs can be used for any task that requires encapsulation,
  modularity, and reusability.

## Usage

- The [GETTING_STARTED.md](./GETTING_STARTED.md) guide is a Notes Lab example
  that demonstrates the basic concepts of Labs.
- The [example.ts](./example.ts) file contains a more advanced example that
  showcases the composability of Labs.

## Contribute

We appreciate your help!

### Style

Run `deno fmt` to format the code.

Run `deno lint` to lint the code.

---

Developed with ❤️ [**@FartLabs**](https://github.com/FartLabs)
