import {ICacheProvider} from "../../providers/cache/ICacheProvider.js";

/**
 * Automates key prefixing and integration with the underlying cache provider for sub-repositories.
 */
export abstract class BaseCacheRepository {
	protected readonly cacheProvider: ICacheProvider;

	protected constructor(cacheProvider: ICacheProvider) {
		this.cacheProvider = cacheProvider;
	}

	/**
	 * Defines the full, context-qualified prefix for this cache service's keys.
	 */
	protected abstract get cacheContextPrefix(): string;

	/**
	 * Forms a fully qualified key.
	 */
	private getKey(identifier?: string): string {
		const prefix = this.cacheContextPrefix;
		return identifier ? `${prefix}:${identifier}` : prefix;
	}

	protected async set(identifier: string, value: any, ttl?: number): Promise<void> {
		await this.cacheProvider.set(this.getKey(identifier), value, ttl);
	}

	protected async get<T = unknown>(identifier: string): Promise<T | null> {
		return await this.cacheProvider.get<T>(this.getKey(identifier));
	}

	protected async delete(identifier: string): Promise<void> {
		await this.cacheProvider.delete(this.getKey(identifier));
	}
}