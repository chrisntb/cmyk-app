import type {
	Container,
	ContainerStatus,
	LocalQueue,
	Node,
	NodeDetails,
	NodeListItem,
	Pod,
	PodDetails,
	PodListItem,
	ResourceFlavor,
} from "../model/k8s";
import { fetchResource } from "./api";

function k8sItems<T>(data: unknown): T[] {
	return (data as { items: T[] }).items;
}

// --- Transformation functions ---

function getNodeRoles(labels: Record<string, string>): string {
	const roles: string[] = [];
	for (const key of Object.keys(labels)) {
		if (key.startsWith("node-role.kubernetes.io/")) {
			roles.push(key.replace("node-role.kubernetes.io/", ""));
		}
	}
	return roles.length > 0 ? roles.join(", ") : "<none>";
}

function isNodeReady(conditions: Node["status"]["conditions"]): boolean {
	const readyCondition = conditions.find((c) => c.type === "Ready");
	return readyCondition?.status === "True";
}

function transformNodeForList(raw: Node) {
	const internalIP = raw.status.addresses.find((a) => a.type === "InternalIP");
	return {
		name: raw.metadata.name,
		ready: isNodeReady(raw.status.conditions),
		roles: getNodeRoles(raw.metadata.labels),
		ip: internalIP?.address ?? "",
		cpu: raw.status.capacity.cpu,
		memory: raw.status.capacity.memory,
		kubeletVersion: raw.status.nodeInfo.kubeletVersion,
	};
}

function transformNodeForDetail(raw: Node) {
	return {
		name: raw.metadata.name,
		uid: raw.metadata.uid,
		creationTimestamp: raw.metadata.creationTimestamp,
		labels: raw.metadata.labels,
		annotations: raw.metadata.annotations,
		ready: isNodeReady(raw.status.conditions),
		roles: getNodeRoles(raw.metadata.labels),
		podCIDR: raw.spec.podCIDR ?? "",
		taints: (raw.spec.taints ?? []).map((t) => ({
			...t,
			value: t.value ?? "",
		})),
		addresses: raw.status.addresses,
		capacity: raw.status.capacity,
		allocatable: raw.status.allocatable,
		conditions: raw.status.conditions,
		nodeInfo: raw.status.nodeInfo,
		images: raw.status.images,
	};
}

function getContainerState(status?: ContainerStatus): {
	state: string;
	reason: string;
} {
	if (!status) return { state: "unknown", reason: "" };
	const stateKeys = Object.keys(status.state);
	const stateKey = stateKeys[0] ?? "unknown";
	const stateReason = status.state[stateKey]?.reason ?? "";
	return { state: stateKey, reason: stateReason };
}

function getStatusClass(phase: string): string {
	switch (phase.toLowerCase()) {
		case "running":
			return "running";
		case "succeeded":
			return "succeeded";
		case "failed":
			return "failed";
		case "pending":
			return "pending";
		default:
			return "unknown";
	}
}

function getVolumeType(volume: { name: string; [key: string]: unknown }): {
	type: string;
	source: string;
} {
	const knownKeys = ["name"];
	for (const key of Object.keys(volume)) {
		if (!knownKeys.includes(key)) {
			const val = volume[key];
			if (typeof val === "object" && val !== null) {
				const obj = val as Record<string, unknown>;
				return {
					type: key,
					source:
						(obj.secretName as string) ??
						(obj.claimName as string) ??
						(obj.path as string) ??
						(obj.name as string) ??
						JSON.stringify(obj),
				};
			}
			return { type: key, source: String(val) };
		}
	}
	return { type: "unknown", source: "" };
}

function transformPodForList(raw: Pod) {
	const totalRestarts = (raw.status.containerStatuses ?? []).reduce(
		(sum, cs) => sum + cs.restartCount,
		0,
	);
	return {
		name: raw.metadata.name,
		namespace: raw.metadata.namespace,
		status: raw.status.phase,
		statusClass: getStatusClass(raw.status.phase),
		node: raw.spec.nodeName ?? "",
		podIP: raw.status.podIP ?? "",
		restarts: totalRestarts,
	};
}

function transformContainerForDetail(
	container: Container,
	status?: ContainerStatus,
) {
	const stateInfo = getContainerState(status);
	return {
		name: container.name,
		image: container.image,
		ports: container.ports ?? null,
		env: (container.env ?? [])
			.filter((e): e is typeof e & { value: string } => e.value !== undefined)
			.map((e) => ({ name: e.name, value: e.value })),
		volumeMounts: (container.volumeMounts ?? []).map((vm) => ({
			name: vm.name,
			mountPath: vm.mountPath,
			readOnly: vm.readOnly ?? false,
		})),
		resources: {
			requestsCpu: container.resources?.requests?.cpu ?? "",
			requestsMemory: container.resources?.requests?.memory ?? "",
			limitsCpu: container.resources?.limits?.cpu ?? "",
			limitsMemory: container.resources?.limits?.memory ?? "",
		},
		ready: status?.ready ?? false,
		restartCount: status?.restartCount ?? 0,
		state: stateInfo.state,
		stateReason: stateInfo.reason,
	};
}

function transformPodForDetail(raw: Pod) {
	const containerStatuses = raw.status.containerStatuses ?? [];
	const initContainerStatuses = raw.status.initContainerStatuses ?? [];

	return {
		name: raw.metadata.name,
		namespace: raw.metadata.namespace,
		uid: raw.metadata.uid,
		creationTimestamp: raw.metadata.creationTimestamp,
		labels: raw.metadata.labels ?? null,
		annotations: raw.metadata.annotations ?? null,
		status: raw.status.phase,
		statusClass: getStatusClass(raw.status.phase),
		node: raw.spec.nodeName ?? "",
		podIP: raw.status.podIP ?? "",
		hostIP: raw.status.hostIP ?? "",
		qosClass: raw.status.qosClass ?? "",
		serviceAccount: raw.spec.serviceAccountName ?? "",
		containers: raw.spec.containers.map((c) => {
			const status = containerStatuses.find((cs) => cs.name === c.name);
			return transformContainerForDetail(c, status);
		}),
		initContainers: raw.spec.initContainers
			? raw.spec.initContainers.map((c) => {
					const status = initContainerStatuses.find((cs) => cs.name === c.name);
					return transformContainerForDetail(c, status);
				})
			: null,
		conditions: (raw.status.conditions ?? []).map((c) => ({
			type: c.type,
			status: c.status,
			reason: c.reason ?? "",
			message: c.message ?? "",
			lastTransitionTime: c.lastTransitionTime,
		})),
		volumes: raw.spec.volumes
			? raw.spec.volumes.map((v) => {
					const info = getVolumeType(v);
					return { name: v.name, type: info.type, source: info.source };
				})
			: null,
		ownerReferences: raw.metadata.ownerReferences
			? raw.metadata.ownerReferences.map((o) => ({
					kind: o.kind,
					name: o.name,
					uid: o.uid,
				}))
			: null,
	};
}

// --- Public K8s API ---

export const fetchK8sNodes = (): Promise<NodeListItem[]> =>
	fetchResource("nodes", "/k8s_nodes.json", (data) =>
		k8sItems<Node>(data).map(transformNodeForList),
	);

export const fetchK8sNodeDetails = (name: string): Promise<NodeDetails> =>
	fetchResource(
		`nodes/${encodeURIComponent(name)}`,
		"/k8s_nodes.json",
		(data) => {
			const node = k8sItems<Node>(data).find((n) => n.metadata.name === name);
			if (!node) throw new Error("Node not found");
			return transformNodeForDetail(node);
		},
	);

export const fetchK8sPods = (): Promise<PodListItem[]> =>
	fetchResource("pods", "/k8s_pods.json", (data) =>
		k8sItems<Pod>(data).map(transformPodForList),
	);

export const fetchK8sPodDetails = (
	namespace: string,
	name: string,
): Promise<PodDetails> =>
	fetchResource(
		`namespaces/${encodeURIComponent(namespace)}/pods/${encodeURIComponent(name)}`,
		"/k8s_pods.json",
		(data) => {
			const pod = k8sItems<Pod>(data).find(
				(p) => p.metadata.namespace === namespace && p.metadata.name === name,
			);
			if (!pod) throw new Error("Pod not found");
			return transformPodForDetail(pod);
		},
	);

export const fetchK8sResourceFlavors = (): Promise<ResourceFlavor[]> =>
	fetchResource<ResourceFlavor[]>(
		"resource-flavors",
		"/k8s_resource_flavors.json",
	);

export const fetchK8sResourceFlavorDetails = (
	name: string,
): Promise<ResourceFlavor> =>
	fetchResource(
		`resource-flavors/${encodeURIComponent(name)}`,
		"/k8s_resource_flavors.json",
		(data) => {
			const flavors = data as ResourceFlavor[];
			const flavor = flavors.find((f) => f.name === name);
			if (!flavor) throw new Error("Resource flavor not found");
			return flavor;
		},
	);

export const fetchK8sLocalQueues = (): Promise<LocalQueue[]> =>
	fetchResource<LocalQueue[]>("local-queues", "/k8s_local_queues.json");

export const fetchK8sLocalQueueDetails = (
	namespace: string,
	name: string,
): Promise<LocalQueue> =>
	fetchResource(
		`namespaces/${encodeURIComponent(namespace)}/local-queues/${encodeURIComponent(name)}`,
		"/k8s_local_queues.json",
		(data) => {
			const queues = data as LocalQueue[];
			const queue = queues.find(
				(q) => q.namespace === namespace && q.name === name,
			);
			if (!queue) throw new Error("Local queue not found");
			return queue;
		},
	);
