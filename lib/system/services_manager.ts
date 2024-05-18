// TODO: Rename to SystemServicesManager.
export class ServicesManager {
  public constructor(
    private readonly services: Services = {},
    private readonly filterAction = defaultFilterAction,
  ) {}

  /**
   * executeAction executes an action with the given state.
   */
  public executeAction(
    serviceName: string,
    actionName: string,
    state?: Record<string, unknown>,
  ): unknown {
    const service = this.services[serviceName];
    if (service === undefined) {
      throw new Error(`Service ${serviceName} not found.`);
    }

    const action = service[actionName];
    if (typeof action !== "function") {
      throw new Error(`Action ${serviceName}.${actionName} not found.`);
    }

    const id: ActionID = { serviceName, actionName };
    if (!this.filterAction(id)) {
      throw new Error(`Action ${serviceName}.${actionName} not allowed.`);
    }

    return action(state);
  }

  /**
   * getActions lists the actions that can be executed.
   */
  public getActions(): ActionID[] {
    return getActionsFromServices(this.services, this.filterAction);
  }
}

export function defaultFilterAction(_id: ActionID): boolean {
  return true;
}

export interface ActionID {
  serviceName: string;
  actionName: string;
}

export function getActionsFromServices(
  services: Services,
  filterAction = defaultFilterAction,
) {
  const actions: ActionID[] = [];
  for (const serviceName in services) {
    const service = services[serviceName];
    const actionNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(service),
    ).filter((name) => name !== "constructor");
    for (const actionName of actionNames) {
      const id: ActionID = { serviceName, actionName };
      if (
        typeof service[actionName] !== "function" ||
        !filterAction(id)
      ) {
        continue;
      }

      actions.push(id);
    }
  }

  return actions.sort((a, b) =>
    a.serviceName.localeCompare(b.serviceName) ||
    a.actionName.localeCompare(b.actionName)
  );
}

// deno-lint-ignore no-explicit-any
export type Services = Record<string, any>;
