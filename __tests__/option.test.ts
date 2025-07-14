import { describe, it, expect } from "bun:test";
import {
	some,
	none,
	is_some,
	is_none,
	unwrap,
	map,
	then,
	all,
	type Option,
} from "../src/option";

describe("option", () => {
	it("should create a some value", () => {
		const value = some(42);
		expect(value.type).toBe("some");
		if (is_some(value)) {
			expect(value.value).toBe(42);
		}
	});

	it("should create a none value", () => {
		const value = none();
		expect(value.type).toBe("none");
	});

	it("should correctly identify a some value", () => {
		const value = some(42);
		expect(is_some(value)).toBe(true);
		expect(is_none(value)).toBe(false);
	});

	it("should correctly identify a none value", () => {
		const value = none();
		expect(is_none(value)).toBe(true);
		expect(is_some(value)).toBe(false);
	});

	it("should unwrap a some value", () => {
		const value = some(42);
		expect(unwrap(value, 0)).toBe(42);
	});

	it("should return the default value when unwrapping a none value", () => {
		const value = none<number>();
		expect(unwrap(value, 0)).toBe(0);
	});

	it("should map a some value", () => {
		const value = some(42);
		const mapped = map(value, (x) => x * 2);
		expect(is_some(mapped)).toBe(true);
		if (is_some(mapped)) {
			expect(mapped.value).toBe(84);
		}
	});

	it("should return none when mapping a none value", () => {
		const value = none<number>();
		const mapped = map(value, (x) => x * 2);
		expect(is_none(mapped)).toBe(true);
	});

	it("should chain a some value with a function that returns a some value", () => {
		const value = some(42);
		const chained = then(value, (x) => some(x * 2));
		expect(is_some(chained)).toBe(true);
		if (is_some(chained)) {
			expect(chained.value).toBe(84);
		}
	});

	it("should chain a some value with a function that returns a none value", () => {
		const value = some(42);
		const chained = then(value, () => none<number>());
		expect(is_none(chained)).toBe(true);
	});

	it("should return none when chaining a none value", () => {
		const value = none<number>();
		const chained = then(value, (x) => some(x * 2));
		expect(is_none(chained)).toBe(true);
	});

	it("should return a some of an array when all options are some", () => {
		const list: Array<Option<number>> = [some(1), some(2), some(3)];
		const result = all(list);
		expect(is_some(result)).toBe(true);
		if (is_some(result)) {
			expect(result.value).toEqual([1, 2, 3]);
		}
	});

	it("should return none when any option in the list is none", () => {
		const list: Array<Option<number>> = [some(1), none(), some(3)];
		const result = all(list);
		expect(is_none(result)).toBe(true);
	});

	it("should return a some of an empty array when the list is empty", () => {
		const list: Array<Option<number>> = [];
		const result = all(list);
		expect(is_some(result)).toBe(true);
		if (is_some(result)) {
			expect(result.value).toEqual([]);
		}
	});
});
