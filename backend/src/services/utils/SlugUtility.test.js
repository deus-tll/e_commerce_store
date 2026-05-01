import { describe, it, expect } from "vitest";
import { SlugUtility } from "./SlugUtility.js";

describe("SlugUtility", () => {
    const slugUtility = new SlugUtility();
    const resolveGenerateSlug = (input, expected) => {
        const result = slugUtility.generateSlug(input);
        expect(result).toBe(expected);
    }

    it("should convert text to lowercase and replace spaces with hyphens", () => {
        const input = "Hello World";
        const expected = "hello-world";

        resolveGenerateSlug(input, expected);
    });

    it("should remove special characters like quotes", () => {
        const input = "L\'oreal \"Expert\" Care";
        const expected = "loreal-expert-care";

        resolveGenerateSlug(input, expected);
    });

    it("should replace non-alphanumeric characters with a single hyphen", () => {
        const input = "iPhone 15 & Pro Max!!!";
        const expected = "iphone-15-pro-max";

        resolveGenerateSlug(input, expected);
    });

    it("should trim hyphens from the start and end of the string", () => {
        const input = "---Clean Me----";
        const expected = "clean-me";

        resolveGenerateSlug(input, expected);
    });

    it("should return an empty string if input is empty or just symbols", () => {
        const input = "!!! @@@";
        const expected = "";

        resolveGenerateSlug(input, expected);
    });
});