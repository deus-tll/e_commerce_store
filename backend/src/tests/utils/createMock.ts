import { vi, Mocked } from "vitest";

export const createMock = <T>(): Mocked<T> => {
    const mock: Record<string | symbol, any> = {};

    return new Proxy({} as any, {
        get(_, prop) {
            if (!(prop in mock)) {
                mock[prop] = vi.fn();
            }
            return mock[prop];
        }
    }) as Mocked<T>;
};