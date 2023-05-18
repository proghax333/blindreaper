
export class ServiceNameAlreadyRegisteredError extends Error {
  constructor(name) {
    super();
    this.message = `Service with the name \`${name}\` already registered.`;
  }
}

export class ServiceNotFoundError extends Error {
  constructor(name) {
    super();
    this.message = `Service with the name \`${name}\` not found.`;
  }
}

export class ServiceNotRegisteredError extends Error {
  constructor(name, error) {
    super();
    this.error = error;
    this.message = `Service with the name \`${name}\` could not be registered due to an error. Error: ${this.error}`;
  }
}

export class ServiceNotInitializedError extends Error {
  constructor(name) {
    super();
    this.message = `Service with the name \`${name}\` is not yet initialized.`;
  }
}


export class ServiceCircularDependencyError extends Error {
  constructor(name, otherName) {
    super();
    this.message = `Service with the name \`${name}\` has a circular dependency with the service ${otherName}.`;
  }
}

export function createContainer() {
  const registry = {};
  const services = registry;

  async function refreshServiceStatuses() {
    for(const [, entry] of Object.entries(registry)) {
      let initialized = true;
      const { dependencies, factory } = entry;

      for(const dependency of dependencies) {
        if(!(dependency in registry)) {
          initialized = false;
          break;
        }
      }

      // console.log("init: ", entry.initialized, initialized);

      if(entry.initialized === false && initialized === true) {
        await entry.init();
      }

      entry.initialized = initialized;
    }
  }

  async function register(options) {
    let { name, factory, dependencies } = options;

    if(name in registry) {
      throw new ServiceNameAlreadyRegisteredError(name);
    }

    try {
      if(!dependencies) {
        dependencies = [];
      }
      options.dependencies = [...dependencies];
      options.dependants = [];

      let initialized = true;

      for(const dependency of dependencies) {
        if(!(dependency in registry)) {
          initialized = false;
        } else if(registry[dependency].dependencies.includes(name)) {
          throw new ServiceCircularDependencyError(name, dependency);
        } else {
          registry[dependency].dependants.push(name);
        }
      }

      /* Service Entry */
      const entry = {
        ...options,
        initialized,
        async init() {
          this.instance = await factory(registry, this);
          console.log(`[ Loaded ] ${this.name}`);

          if(this.onInit) {
            this.onInit();
          }
        }
      };

      if(initialized) {
        await entry.init();
      }

      registry[name] = entry;
      await refreshServiceStatuses();

      return entry;
    } catch (e) {
      throw new ServiceNotRegisteredError(name, e);
    }
  }

  async function unregister(options) {
    const { name } = options;

    if(!(name in registry)) {
      throw new ServiceNotFoundError(name);
    }

    delete registry[name];
  }

  async function get(name) {
    if(!(name in registry)) {
      throw new ServiceNotFoundError(name);
    }

    const entry = registry[name];

    if(!entry.initialized) {
      throw new ServiceNotInitializedError(name);
    }

    return entry.instance;
  }

  return {
    services,
    register,
    unregister,
    get
  }
}
