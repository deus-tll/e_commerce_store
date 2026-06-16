type TokenConstructor<T = any> = abstract new (...args: any[]) => T;
type Constructor<T = any> = new (...args: any[]) => T;

enum DependencyKind {
    CLASS = "class",
    PRIMITIVE = "primitive"
}

interface Dependency {
    kind: DependencyKind;
    value: any;
}

interface Definition {
    implementation: Constructor;
    dependencies: Dependency[]
}

export class Container {
    private definitions = new Map<TokenConstructor, Definition>();
    private instances = new Map<TokenConstructor, any>();
    private resolving = new Set<Constructor>();
    private isBooted = false;

    private resolve(ctorToken: TokenConstructor): any {
        if (this.instances.has(ctorToken)) return this.instances.get(ctorToken);

        const definition = this.definitions.get(ctorToken);
        if (!definition) throw new Error(`[Container] '${ctorToken.name}' not registered.`);

        const { implementation, dependencies } = definition;

        if (this.resolving.has(implementation)) {
            const chain = [...this.resolving, implementation]
                .map(ctor => ctor.name)
                .join(" -> ");

            throw new Error(`[Container] Circular dependency detected: ${chain}`);
        }

        this.resolving.add(implementation);

        try {
            const args = dependencies.map(def => {
                const { kind, value } = def;

                return kind === DependencyKind.CLASS
                    ? this.resolve(value)
                    : value;
            });

            const instance = new implementation(...args);
            this.instances.set(ctorToken, instance);

            return instance;
        }
        finally {
            this.resolving.delete(implementation);
        }
    }

    register<Token, Implementation>(
        definition: {
            token: TokenConstructor<Token>,
            implementation?: Constructor<Implementation>,
        },
        deps: any[] = []
    ): void {
        const { token, implementation } = definition;

        if (this.definitions.has(token)) {
            throw new Error("[Container] Definition already registered.");
        }

        const normalizedDeps = deps.map(dep => {
            const result: Dependency = {
                kind: (typeof dep === "function" && dep.prototype)
                    ? DependencyKind.CLASS
                    : DependencyKind.PRIMITIVE,
                value: dep
            }

            return result;
        });

        this.definitions.set(token, {
            implementation: implementation || (token as Constructor),
            dependencies: normalizedDeps
        });
    }

    boot() {
        if (this.isBooted) return;

        for (const ctor of this.definitions.keys()) {
            this.resolve(ctor);
        }

        this.isBooted = true;
    }

    get<T>(ctor: TokenConstructor<T>): T {
        if (!this.isBooted) {
            throw new Error("[Container] Must be booted first.");
        }

        const instance = this.instances.get(ctor);
        if (!instance) {
            throw new Error(`[Container] '${ctor.name}' was not resolved during boot.`);
        }

        return instance as T;
    }
}