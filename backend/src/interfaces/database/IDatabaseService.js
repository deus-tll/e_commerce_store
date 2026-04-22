/**
 * @interface IDatabaseService
 * @description Defines the contract for database lifecycle management
 */
export class IDatabaseService {
    /**
     * Establishes a connection to the database.
     * @returns {Promise<any>}
     */
    async connect() { throw new Error("Method not implemented"); }

    /**
     * Closes the database connection.
     * @returns {Promise<void>}
     */
    async disconnect() { throw new Error("Method not implemented."); }

    /**
     * Drops the entire database (development only).
     * @returns {Promise<void>}
     */
    async drop() { throw new Error("Method not implemented."); }
}