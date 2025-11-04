import container from "../../config/dependencyContainer.js";
import {BaseSeeder} from "../../seeders/BaseSeeder.js";

/**
 * A service locator class to centralize the retrieval of dependencies
 * from the IoC container. This isolates the container-specific logic
 * and provides clear, type-hinted methods for common dependency types.
 */
export class DependencyLocator {
	/**
	 * Private method to retrieve any dependency instance from the container.
	 * @param {string} name - The registration key of the dependency.
	 * @returns {any} The instance from the container.
	 * @private
	 */
	static #getInstance(name) {
		return container.get(name);
	}

	/**
	 * Retrieves a specific Express Router instance from the IoC container.
	 * @param {string} name - The key associated with the router in the RouterTypes constant.
	 * @returns {import('express').Router} The Express Router instance.
	 */
	static getRouter(name) {
		return DependencyLocator.#getInstance(name);
	}

	/**
	 * Retrieves a specific Seeder instance from the IoC container.
	 * @param {string} name - The key associated with the seeder in the SeederTypes constant.
	 * @returns {BaseSeeder} The Seeder instance.
	 */
	static getSeeder(name) {
		return DependencyLocator.#getInstance(name);
	}
}