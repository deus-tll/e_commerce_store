import {ICacheProvider} from "./ICacheProvider.js";

export class MemoryCacheProvider extends ICacheProvider {
    private readonly storage = new Map<string, any>();

    override async connect(): Promise<void> {
        console.log("[MemoryCache] Initialized.");
        return Promise.resolve();
    }

    override async get<T = unknown>(key: string): Promise<T | null> {
        const data = this.storage.get(key);
        return data ? data as T : null;
    }

    override async set(key: string, value: any, _?: number): Promise<void> {
        this.storage.set(key, value);
        return Promise.resolve();
    }

    override async delete(key: string): Promise<void> {
        this.storage.delete(key);
        return Promise.resolve();
    }

    override async disconnect(): Promise<void> {
        this.storage.clear();
        console.log("[MemoryCache] Cleared.");
        return Promise.resolve();
    }
}