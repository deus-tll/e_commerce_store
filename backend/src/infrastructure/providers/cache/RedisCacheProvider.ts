import {Redis} from "ioredis";
import {ICacheProvider} from "./ICacheProvider.js";

const enum EventType {
    CONNECT = "connect",
    ERROR = "error",
}

const enum StatusType {
    WAIT = "wait",
    CLOSE = "close",
}

export class RedisCacheProvider extends ICacheProvider {
    private isConnected: boolean = false;

    constructor(private readonly client: Redis) {
        super();
        this.setupEvents();
    }

    private setupEvents(): void {
        this.client.on(EventType.CONNECT, () => {
            this.isConnected = true;
            console.log("[Redis] Connected.");
        });

        this.client.on(EventType.ERROR, (err) => {
            this.isConnected = false;
            console.error(`[Redis] Error: ${err.message}`);
        });
    }

    override async connect(): Promise<void> {
        if (this.client.status === StatusType.WAIT || this.client.status === StatusType.CLOSE) {
            await this.client.connect();
        }
    }

    override async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.quit();
            console.log("[Redis] Disconnected.");
        }
    }

    override async get<T = unknown>(key: string): Promise<T | null> {
        if (!this.isConnected) return null;

        const data = await this.client.get(key);
        if (!data) return null;

        try {
            return JSON.parse(data) as T;
        } catch (err) {
            console.warn(`[Redis] Failed to parse JSON for key "${key}":`, err.message);
            return data as unknown as T;
        }
    }

    override async set(key: string, value: any, ttl?: number): Promise<void> {
        if (!this.isConnected) return;

        const data = JSON.stringify(value);
        if (ttl) {
            await this.client.set(key, data, "EX", ttl);
        }
        else {
            await this.client.set(key, data);
        }
    }

    override async delete(key: string): Promise<void> {
        if (!this.isConnected) return;
        await this.client.del(key);
    }
}