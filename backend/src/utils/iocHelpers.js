/**
 * Helper function to retrieve a specific Express Router instance from the IoC container.
 * This function ensures static type checking tools (like VS Code/TypeScript) recognize the
 * returned object as a valid Express Router.
 * @param {import('../config/dependencyContainer.js').default} container
 * @param {string} name
 * @returns {import('express').Router}
 */
export function getRouter(container, name) {
	return container.get(name);
}