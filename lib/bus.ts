// Tiny event bridge: any button can pre-select a service in the contact form without prop drilling.
export const SERVICE_EVENT = "ybc:service";

export function requestService(service: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(SERVICE_EVENT, { detail: service }));
}
