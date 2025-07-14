import { describe, it, expect } from "bun:test";
import {
	ok,
	err,
	is_ok,
	is_err,
	unwrap,
	unwrap_error,
	map,
	map_error,
	replace,
	replace_error,
	or,
	then,
	all,
	type Result,
} from "../src/result";

describe("result", () => {
	it("should create an ok value", () => {
		const value = ok(42);
		expect(value.type).toBe("ok");
		if (is_ok(value)) {
			expect(value.value).toBe(42);
		}
	});

	it("should create an err value", () => {
		const value = err("error");
		expect(value.type).toBe("err");
		if (is_err(value)) {
			expect(value.value).toBe("error");
		}
	});

	it("should correctly identify an ok value", () => {
		const value = ok(42);
		expect(is_ok(value)).toBe(true);
		expect(is_err(value)).toBe(false);
	});

	it("should correctly identify an err value", () => {
		const value = err("error");
		expect(is_err(value)).toBe(true);
		expect(is_ok(value)).toBe(false);
	});

	it("should unwrap an ok value", () => {
		const value = ok(42);
		expect(unwrap(value, 0)).toBe(42);
	});

	it("should return the default value when unwrapping an err value", () => {
		const value = err<string>("error");
		expect(unwrap(value, 0)).toBe(0);
	});

	it("should unwrap_error an err value", () => {
		const value = err("error");
		expect(unwrap_error(value, "default")).toBe("error");
	});

	it("should return the default value when unwrapping_error an ok value", () => {
		const value = ok(42);
		expect(unwrap_error(value, "default")).toBe("default");
	});

	it("should map an ok value", () => {
		const value = ok(42);
		const mapped = map(value, (x) => x * 2);
		expect(is_ok(mapped)).toBe(true);
		if (is_ok(mapped)) {
			expect(mapped.value).toBe(84);
		}
	});

	it("should not map an err value", () => {
		const value = err<string>("error");
		const mapped = map(value, (x: number) => x * 2);
		expect(is_err(mapped)).toBe(true);
		if (is_err(mapped)) {
			expect(mapped.value).toBe("error");
		}
	});

	it("should map_error an err value", () => {
		const value = err("error");
		const mapped = map_error(value, (x) => `new ${x}`);
		expect(is_err(mapped)).toBe(true);
		if (is_err(mapped)) {
			expect(mapped.value).toBe("new error");
		}
	});

	it("should not map_error an ok value", () => {
		const value = ok(42);
		const mapped = map_error(value, (x: string) => `new ${x}`);
		expect(is_ok(mapped)).toBe(true);
		if (is_ok(mapped)) {
			expect(mapped.value).toBe(42);
		}
	});

	it("should replace an ok value", () => {
		const value = ok(42);
		const replaced = replace(value, "new value");
		expect(is_ok(replaced)).toBe(true);
		if (is_ok(replaced)) {
			expect(replaced.value).toBe("new value");
		}
	});

	it("should not replace an err value", () => {
		const value = err<string>("error");
		const replaced = replace(value, "new value");
		expect(is_err(replaced)).toBe(true);
		if (is_err(replaced)) {
			expect(replaced.value).toBe("error");
		}
	});

	it("should replace_error an err value", () => {
		const value = err("error");
		const replaced = replace_error(value, "new error");
		expect(is_err(replaced)).toBe(true);
		if (is_err(replaced)) {
			expect(replaced.value).toBe("new error");
		}
	});

	it("should not replace_error an ok value", () => {
		const value = ok(42);
		const replaced = replace_error(value, "new error");
		expect(is_ok(replaced)).toBe(true);
		if (is_ok(replaced)) {
			expect(replaced.value).toBe(42);
		}
	});

	it("should return the first ok value with or", () => {
		const value1 = ok(42);
		const value2 = ok(100);
		const result = or(value1, value2);
		expect(is_ok(result)).toBe(true);
		if (is_ok(result)) {
			expect(result.value).toBe(42);
		}
	});

	it("should return the second value if the first is an err with or", () => {
		const value1 = err("error");
		const value2 = ok(100);
		const result = or(value1, value2);
		expect(is_ok(result)).toBe(true);
		if (is_ok(result)) {
			expect(result.value).toBe(100);
		}
	});

	it("should chain an ok value with a function that returns an ok value", () => {
		const value = ok(42);
		const chained = then(value, (x) => ok(x * 2));
		expect(is_ok(chained)).toBe(true);
		if (is_ok(chained)) {
			expect(chained.value).toBe(84);
		}
	});

	it("should chain an ok value with a function that returns an err value", () => {
		const value = ok(42);
		const chained = then(value, () => err("new error"));
		expect(is_err(chained)).toBe(true);
		if (is_err(chained)) {
			expect(chained.value).toBe("new error");
		}
	});

	it("should not chain an err value", () => {
		const value = err<string>("error");
		const chained = then(value, (x: number) => ok(x * 2));
		expect(is_err(chained)).toBe(true);
		if (is_err(chained)) {
			expect(chained.value).toBe("error");
		}
	});

	it("should return an ok of an array when all results are ok", () => {
		const list: Array<Result<number, string>> = [ok(1), ok(2), ok(3)];
		const result = all(list);
		expect(is_ok(result)).toBe(true);
		if (is_ok(result)) {
			expect(result.value).toEqual([1, 2, 3]);
		}
	});

	it("should return the first err when any result in the list is an err", () => {
		const list: Array<Result<number, string>> = [
			ok(1),
			err("error"),
			ok(3),
		];
		const result = all(list);
		expect(is_err(result)).toBe(true);
		if (is_err(result)) {
			expect(result.value).toBe("error");
		}
	});

	it("should return an ok of an empty array when the list is empty", () => {
		const list: Array<Result<number, string>> = [];
		const result = all(list);
		expect(is_ok(result)).toBe(true);
		if (is_ok(result)) {
			expect(result.value).toEqual([]);
		}
	});
});
