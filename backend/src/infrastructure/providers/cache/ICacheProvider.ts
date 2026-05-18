/**
 * Defines the contract for cache storage lifecycle and data operations.
 */
export abstract class ICacheProvider {
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract get<T = unknown>(key: string): Promise<T | null>
    abstract set(key: string, value: any, ttl?: number): Promise<void>;
    abstract delete(key: string): Promise<void>;
}