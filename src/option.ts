type Some<T> = { readonly value: T; type: "some" };

type None = { readonly type: "none" };

export type Option<T> = Some<T> | None;

export function Some<T>(value: T): Option<T> {
	return { type: "some", value };
}

export function None<T>(): Option<T> {
	return { type: "none" };
}

export function is_some<T>(option: Option<T>): option is Some<T> {
	return option.type === "some";
}

export function is_none<T>(option: Option<T>): option is None {
	return !is_some(option);
}

export function unwrap<T>(option: Option<T>, with_default: T): T {
	switch (option.type) {
		case "some":
			return option.value;

		default:
			return with_default;
	}
}

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
