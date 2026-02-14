import { isMockMode } from "./mock-mode.svelte";

const API_BASE = "http://127.0.0.1:4000/api/v1";

export async function fetchResource<T = unknown>(
	endpoint: string,
	mockFile: string,
	mockTransform?: (data: unknown) => T,
): Promise<T> {
	if (isMockMode()) {
		const res = await fetch(mockFile);
		const data = await res.json();
		return mockTransform ? mockTransform(data) : data;
	}
	let res: Response;
	try {
		res = await fetch(`${API_BASE}/${endpoint}`);
	} catch {
		throw new Error("Service temporarily unavailable");
	}
	if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
	if (res.status === 204) return undefined as T;
	return res.json();
}
