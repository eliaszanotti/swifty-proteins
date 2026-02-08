export interface ServerActionResult<T = void> {
	success: boolean;
	message?: string;
	data?: T;
}

export function createErrorResult<T = void>(
	message: string,
): ServerActionResult<T> {
	return {
		success: false,
		message,
	};
}
