/**
 * Some represents any data that exists
 */
type Some<T> = { readonly value: T; type: "some" };

/**
 * None is similar to null or undefined
 * when value doesn't exist
 */
type None = { readonly type: "none" };

/**
 * Option is a maybe type
 */
export type Option<T> = Some<T> | None;

/**
 * create a new some value from any value
 * @param value - internal value of the option
 * @returns a new option
 */
export function some<T>(value: T): Option<T> {
	return { type: "some", value };
}

/**
 * create a new none value
 * @returns a new none type
 */
export function none<T>(): Option<T> {
	return { type: "none" };
}

/**
 * Checks if an Option is of type 'some'.
 * @param option - The Option to check.
 * @returns True if the option is 'some', false otherwise.
 */
export function is_some<T>(option: Option<T>): option is Some<T> {
	return option.type === "some";
}

/**
 * Checks if an Option is of type 'none'.
 * @param option - The Option to check.
 * @returns True if the option is 'none', false otherwise.
 */
export function is_none<T>(option: Option<T>): option is None {
	return !is_some(option);
}

/**
 * Unwraps the value from a 'some' Option or returns a default value for 'none' Option.
 * @param option - The Option to unwrap.
 * @param with_default - The default value to return if the option is 'none'.
 * @returns The value from 'some' or the default value.
 */
export function unwrap<T>(option: Option<T>, with_default: T): T {
	switch (option.type) {
		case "some":
			return option.value;

		default:
			return with_default;
	}
}

/**
 * Maps the value of a 'some' Option using a predicate function.
 * If the Option is 'none', it returns a 'none' Option.
 * @param option - The Option to map.
 * @param predicate - The function to apply to the value if the option is 'some'.
 * @returns A new Option with the mapped value, or a 'none' Option.
 */
export function map<T, U>(
	option: Option<T>,
	predicate: (value: T) => U,
): Option<U> {
	switch (option.type) {
		case "some":
			return { type: "some", value: predicate(option.value) };

		default:
			return { type: "none" };
	}
}

/**
 * Applies a function that returns an Option to the value of a 'some' Option.
 * This is useful for chaining operations that might return 'none'.
 * If the Option is 'none', it returns a 'none' Option.
 * @param option - The initial Option.
 * @param apply - The function to apply to the value if the option is 'some', returning a new Option.
 * @returns A new Option resulting from the application, or a 'none' Option.
 */
export function then<T, U>(
	option: Option<T>,
	apply: (value: T) => Option<U>,
): Option<U> {
	switch (option.type) {
		case "some":
			return apply(option.value);

		default:
			return { type: "none" };
	}
}

/**
 * Combines an array of Options into a single Option of an array.
 * If any Option in the list is 'none', the result is a 'none' Option.
 * Otherwise, it returns a 'some' Option containing an array of all unwrapped values.
 * @param list - An array of Options.
 * @returns An Option containing an array of values, or a 'none' Option.
 */
export function all<T>(list: Array<Option<T>>): Option<Array<T>> {
	return list.reduce<Option<Array<T>>>(
		(acc, option) => {
			if (option.type === "none" || acc.type === "none") {
				return { type: "none" };
			}

			return { type: "some", value: [...acc.value, option.value] };
		},
		{ type: "some", value: [] },
	);
}
