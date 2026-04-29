export class DIContainer {
    constructor() {
        this.services = new Map();
        this.resolving = new Set();
    }

    /**
     * Registers a service.
     * @param {string} name - Unique token.
     * @param {function|Class} definition - Factory function OR Class constructor.
     * @param {string[]} [dependencies=null] - Optional array of tokens to inject.
     */
    register(name, definition, dependencies = null) {
        if (dependencies && typeof definition === 'function' && definition.prototype) {
            const expected = definition.length;
            const actual = dependencies.length;

            if (actual !== expected) {
                throw new Error(
                    `[DI Error]: "${name}" registration mismatch. ` +
                    `Class expects ${expected} arguments, but ${actual} were provided.`
                );
            }
        }

        this.services.set(name, { definition, dependencies, instance: null });
    }

    /**
     * Gets a registered service.
     * @param {string} name
     */
    get(name) {
        const service = this.services.get(name);

        if (!service) {
            throw new Error(`[DI Error]: Service "${name}" is not registered in the container.`);
        }

        if (service.instance) return service.instance;

        if (this.resolving.has(name)) {
            const chain = [...this.resolving, name].join(" -> ");
            throw new Error(`[DI Error]: Circular dependency detected: ${chain}`);
        }

        this.resolving.add(name);

        try {
            const { definition, dependencies } = service;

            if (dependencies) {
                const resolvedDeps = dependencies.map(dep => this.get(dep));
                service.instance = new definition(...resolvedDeps);
            }
            else {
                service.instance = definition(this);
            }

            return service.instance;
        }
        finally {
            this.resolving.delete(name);
        }
    }

    /**
     * Ensures all registered services can be resolved without errors.
     */
    verify() {
        console.log("[IoC Container] Verifying...");
        for (const name of this.services.keys()) {
            this.get(name);
        }
        console.log("[IoC Container] Verified successfully.");
    }
}