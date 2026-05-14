/**
 * Abstract contract for Database lifecycle management.
 */
export abstract class IDatabaseProvider {
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;

    /**
     * Drops the entire database (development only).
     */
    abstract drop(): Promise<void>;
}