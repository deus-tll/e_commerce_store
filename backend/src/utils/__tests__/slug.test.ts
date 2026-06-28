import {describe, it, expect} from "vitest";
import {Slug} from "../slug.js";

describe("Slug Utility", () => {
    it("should convert text to lowercase and replace spaces with hyphens", () => {
        const input = "Hello World";
        const expected = "hello-world";

        expect(Slug.generate(input)).toBe(expected);
    });

    it("should remove special characters like quotes", () => {
        const input = "L\'oreal \"Expert\" Care";
        const expected = "loreal-expert-care";

        expect(Slug.generate(input)).toBe(expected);
    });

    it("should replace non-alphanumeric characters with a single hyphen", () => {
        const input = "iPhone 15 & Pro Max!!!";
        const expected = "iphone-15-pro-max";

        expect(Slug.generate(input)).toBe(expected);
    });

    it("should trim hyphens from the start and end of the string", () => {
        const input = "---Clean Me----";
        const expected = "clean-me";

        expect(Slug.generate(input)).toBe(expected);
    });

    it("should return an empty string if input is empty or just symbols", () => {
        const input = "!!! @@@";
        const expected = "";

        expect(Slug.generate(input)).toBe(expected);
    });
});