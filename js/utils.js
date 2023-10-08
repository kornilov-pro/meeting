/**
 *
 * @param {Date} date
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 * @param {number} milliseconds
 * @returns {Date}
 */
function withTime(date, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
	var result = new Date(date.getTime());
	result.setHours(hours);
	result.setMinutes(minutes);
	result.setSeconds(seconds);
	result.setMilliseconds(milliseconds);
	return result;
}

/**
 *
 * @param {{start: Date, end: Date}} interval
 * @returns {(value: {start: Date, end: Date}) => boolean}
 */
function isInInterval(interval) {
	return ({ start, end }) => start.getTime() < interval.end.getTime() && end.getTime() >= interval.end.getTime();
}

/**
 * Группирует массив по ключу, возвращаемому getKey
 *
 * @template T
 * @param {(value: T) => string} getKey
 * @returns {(result: Record<string, T[]>, value: T) => Record<string, T[]>}
 */
function groupByReducer(getKey) {
	return function (result, value) {
		var key = getKey(value);
		result = { ...result, [key]: result[key] ?? [] };
		return { ...result, [key]: [...result[key], value] };
	};
}

/**
 * Возвращает пару элементов,
 * где первый элемент предыдущее значение, второй - текущее
 *
 * @template T
 * @param {T} value
 * @param {number} index
 * @param {T[]} array
 * @returns {[lastValue: T | null, currentValue: T]}
 */
function pairwise(value, index, array) {
	return [index > 0 ? array[index - 1] : null, value];
}

/**
 *
 * @param {RequestInfo | URL} input
 * @param {RequestInit & {timeout: number}} [init]
 * @returns
 */
async function fetchWithTimeout(input, init = {}) {
	const { timeout = 8000 } = init;

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	const response = await fetch(input, {
		...init,
		signal: controller.signal,
	});
	clearTimeout(id);

	return response;
}

/**
 *
 * @template T
 * @template U
 * @param {(repeat: (value: U) => void, value: U) => T | Promise<T>} fn
 * @param {U} [initialValue]
 * @returns {Promise<T>}
 */
function retry(fn, initialValue) {
	return new Promise((resolve, reject) => {
		var repeat = (value) => resolve(retry(fn, value));
		Promise.resolve()
			.then(() => fn(repeat, initialValue))
			.then(resolve)
			.catch(reject);
	});
}
