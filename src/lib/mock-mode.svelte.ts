import { browser } from "$app/environment";

let mockMode = $state(
	browser ? localStorage.getItem("mockMode") !== "false" : true,
);

export function isMockMode(): boolean {
	return mockMode;
}

export function setMockMode(value: boolean) {
	mockMode = value;
	if (browser) {
		localStorage.setItem("mockMode", String(value));
	}
}
