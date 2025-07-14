/**
 * Err represents any error
 * @template E - The type of the error value.
 */
type Err<E> = { readonly type: "err"; value: E };

/**
 * Ok represents successful results
 * @template T - The type of the success value.
 */
type Ok<T> = { readonly type: "ok"; value: T };

/**
 * A Result can be either a success (Ok) or a failure (Err) response.
 * This union type is used for functions that can either return a valid value
 * or an error, promoting explicit error handling.
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Creates an `Ok` result containing the given value.
 * @template T - The type of the successful value.
 * @param {T} value - The value to wrap in an `Ok` result.
 * @returns {Result<T, never>} An `Ok` result.
 */
export function ok<T>(value: T): Result<T, never> {
	return {
		type: "ok",
		value,
	};
}

/**
 * Creates an `Err` result containing the given error value.
 * @template E - The type of the error value.
 * @param {E} value - The error value to wrap in an `Err` result.
 * @returns {Result<never, E>} An `Err` result.
 */
export function err<E>(value: E): Result<never, E> {
	return {
		type: "err",
		value,
	};
}

/**
 * Checks if a `Result` is an `Ok` type.
 * This is a type guard that narrows the type of `result` to `Ok<T>`.
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 * @param {Result<T, E>} result - The result to check.
 * @returns {result is Ok<T>} `true` if the result is `Ok`, `false` otherwise.
 */
export function is_ok<T, E>(result: Result<T, E>): result is Ok<T> {
	return result.type === "ok";
}

/**
 * Checks if a `Result` is an `Err` type.
 * This is a type guard that narrows the type of `result` to `Err<E>`.
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 * @param {Result<T, E>} result - The result to check.
 * @returns {result is Err<E>} `true` if the result is `Err`, `false` otherwise.
 */
export function is_err<T, E>(result: Result<T, E>): result is Err<E> {
	return !is_ok(result);
}

/**
 * Extracts the successful value from an `Ok` result, or returns a default value if it's an `Err`.
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 * @param {Result<T, E>} result - The result from which to unwrap the value.
 * @param {T} with_default - The default value to return if the result is an `Err`.
 * @returns {T} The successful value if `result` is `Ok`, otherwise `with_default`.
 */
export function unwrap<T, E>(result: Result<T, E>, with_default: T): T {
	return result.type === "ok" ? result.value : with_default;
}

/**
 * Extracts the error value from an `Err` result, or returns a default error value if it's an `Ok`.
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 * @param {Result<T, E>} result - The result from which to unwrap the error value.
 * @param {E} with_default - The default error value to return if the result is `Ok`.
 * @returns {E} The error value if `result` is `Err`, otherwise `with_default`.
 */
export function unwrap_error<T, E>(result: Result<T, E>, with_default: E): E {
	return result.type === "err" ? result.value : with_default;
}

/**
 * Transforms the successful value of a `Result` using a mapping function.
 * If the result is `Ok`, the `apply` function is called with its value, and a new `Ok` result
 * containing the transformed value is returned. If the result is `Err`, it is returned unchanged.
 * @template T - The original type of the successful value.
 * @template E - The type of the error value.
 * @template U - The new type of the successful value after transformation.
 * @param {Result<T, E>} result - The result to map.
 * @param {(value: T) => U} apply - The function to apply to the successful value.
 * @returns {Result<U, E>} A new `Result` with the mapped successful value, or the original `Err`.
 */
export function map<T, E, U>(
	result: Result<T, E>,
	apply: (value: T) => U,
): Result<U, E> {
	switch (result.type) {
		case "ok":
			return ok(apply(result.value));

		default:
			return result;
	}
}

/**
 * Transforms the error value of a `Result` using a mapping function.
 * If the result is `Err`, the `apply` function is called with its error value, and a new `Err` result
 * containing the transformed error value is returned. If the result is `Ok`, it is returned unchanged.
 * @template T - The type of the successful value.
 * @template E - The original type of the error value.
 * @template U - The new type of the error value after transformation.
 * @param {Result<T, E>} result - The result whose error value to map.
 * @param {(value: E) => U} apply - The function to apply to the error value.
 * @returns {Result<T, U>} A new `Result` with the mapped error value, or the original `Ok`.
 */
export function map_error<T, E, U>(
	result: Result<T, E>,
	apply: (value: E) => U,
): Result<T, U> {
	switch (result.type) {
		case "err":
			return err(apply(result.value));

		default:
			return result;
	}
}

/**
 * Replaces the successful value of an `Ok` result with a new value.
 * If the result is `Ok`, a new `Ok` result with the provided `value` is returned.
 * If the result is `Err`, it is returned unchanged.
 * @template T - The original type of the successful value.
 * @template E - The type of the error value.
 * @template U - The new type of the successful value.
 * @param {Result<T, E>} result - The result whose successful value to replace.
 * @param {U} value - The new value to put into an `Ok` result.
 * @returns {Result<U, E>} A new `Result` with the replaced successful value, or the original `Err`.
 */
export function replace<T, E, U>(result: Result<T, E>, value: U): Result<U, E> {
	switch (result.type) {
		case "ok":
			return ok(value);

		default:
			return result;
	}
}

/**
 * Replaces the error value of an `Err` result with a new value.
 * If the result is `Err`, a new `Err` result with the provided `value` is returned.
 * If the result is `Ok`, it is returned unchanged.
 * @template T - The type of the successful value.
 * @template E - The original type of the error value.
 * @template U - The new type of the error value.
 * @param {Result<T, E>} result - The result whose error value to replace.
 * @param {U} value - The new error value to put into an `Err` result.
 * @returns {Result<T, U>} A new `Result` with the replaced error value, or the original `Ok`.
 */
export function replace_error<T, E, U>(
	result: Result<T, E>,
	value: U,
): Result<T, U> {
	switch (result.type) {
		case "err":
			return err(value);

		default:
			return result;
	}
}

/**
 * Returns the first `Ok` result from two `Result` inputs.
 * If the `left` result is `Ok`, it is returned. Otherwise, the `right` result is returned.
 * This is useful for providing a fallback successful result.
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 * @param {Result<T, E>} left - The primary result.
 * @param {Result<T, E>} right - The fallback result.
 * @returns {Result<T, E>} The `left` result if it's `Ok`, otherwise the `right` result.
 */
export function or<T, E>(left: Result<T, E>, right: Result<T, E>) {
	if (is_ok(left)) {
		return left;
	}

	return right;
}

/**
 * Chains a function that returns a `Result` to an existing `Result`.
 * If the `result` is `Ok`, the `apply` function is called with its value, and its returned `Result` is returned.
 * If the `result` is `Err`, it is returned unchanged.
 * This is similar to `map`, but `apply` also returns a `Result`, allowing for sequential operations.
 * @template T - The original type of the successful value.
 * @template U - The new type of the successful value after chaining.
 * @template E - The type of the error value.
 * @param {Result<T, E>} result - The initial result.
 * @param {(value: T) => Result<U, E>} apply - The function to apply to the successful value, which itself returns a `Result`.
 * @returns {Result<U, E>} A new `Result` from the chained operation, or the original `Err`.
 */
export function then<T, U, E>(
	result: Result<T, E>,
	apply: (value: T) => Result<U, E>,
): Result<U, E> {
	switch (result.type) {
		case "ok":
			return apply(result.value);

		default:
			return result;
	}
}

/**
 * Combines an array of `Result`s into a single `Result` containing an array of successful values.
 * If all results in the list are `Ok`, returns an `Ok` result containing an array of all successful values.
 * If any result in the list is `Err`, returns the first `Err` encountered.
 * This is useful for aggregating multiple fallible operations.
 * @template T - The type of the successful value within each `Result`.
 * @template E - The type of the error value within each `Result`.
 * @param {Array<Result<T, E>>} list - An array of `Result` instances.
 * @returns {Result<Array<T>, E>} An `Ok` result with an array of values if all were `Ok`, or the first `Err` encountered.
 */
export function all<T, E>(list: Array<Result<T, E>>): Result<Array<T>, E> {
	return list.reduce<Result<Array<T>, E>>(
		(acc, result) => {
			if (acc.type === "err") {
				return acc;
			}

			if (result.type === "err") {
				return err(result.value);
			}

			return { type: "ok", value: [...acc.value, result.value] };
		},
		{ type: "ok", value: [] },
	);
}
