import { vi } from "vitest";

export const createMockFromInterface = (InterfaceClass) => {
    const mock = {};
    const methods = Object.getOwnPropertyNames(InterfaceClass.prototype)
        .filter(method => method !== "constructor" && typeof InterfaceClass.prototype[method] === "function");

    methods.forEach(method => {
        mock[method] = vi.fn();
    });

    return mock;
};