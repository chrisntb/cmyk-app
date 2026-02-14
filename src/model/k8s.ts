// --- Raw K8s types for transformation ---

export interface Node {
	metadata: {
		name: string;
		uid: string;
		creationTimestamp: string;
		labels: Record<string, string>;
		annotations: Record<string, string>;
	};
	spec: {
		podCIDR?: string;
		taints?: { key: string; value?: string; effect: string }[];
	};
	status: {
		addresses: { type: string; address: string }[];
		capacity: Record<string, string>;
		allocatable: Record<string, string>;
		conditions: {
			type: string;
			status: string;
			reason: string;
			message: string;
			lastHeartbeatTime: string;
			lastTransitionTime: string;
		}[];
		nodeInfo: {
			architecture: string;
			bootID: string;
			containerRuntimeVersion: string;
			kernelVersion: string;
			kubeletVersion: string;
			machineID: string;
			operatingSystem: string;
			osImage: string;
		};
		images: { names: string[]; sizeBytes: number }[];
	};
}

export interface Pod {
	metadata: {
		name: string;
		namespace: string;
		uid: string;
		creationTimestamp: string;
		labels?: Record<string, string>;
		annotations?: Record<string, string>;
		ownerReferences?: {
			apiVersion: string;
			kind: string;
			name: string;
			uid: string;
		}[];
	};
	spec: {
		nodeName?: string;
		serviceAccountName?: string;
		containers: Container[];
		initContainers?: Container[];
		volumes?: {
			name: string;
			[key: string]: unknown;
		}[];
	};
	status: {
		phase: string;
		podIP?: string;
		hostIP?: string;
		qosClass?: string;
		conditions?: {
			type: string;
			status: string;
			reason?: string;
			message?: string;
			lastTransitionTime: string;
		}[];
		containerStatuses?: ContainerStatus[];
		initContainerStatuses?: ContainerStatus[];
	};
}

export interface Container {
	name: string;
	image: string;
	ports?: { containerPort: number; protocol: string }[];
	env?: { name: string; value?: string; valueFrom?: unknown }[];
	volumeMounts?: { name: string; mountPath: string; readOnly?: boolean }[];
	resources?: {
		requests?: Record<string, string>;
		limits?: Record<string, string>;
	};
}

export interface ContainerStatus {
	name: string;
	ready: boolean;
	restartCount: number;
	state: Record<string, { reason?: string; startedAt?: string }>;
}

// --- Exported K8s entity types ---

export interface NodeListItem {
	name: string;
	ready: boolean;
	roles: string;
	ip: string;
	cpu: string;
	memory: string;
	kubeletVersion: string;
}

export interface NodeDetails {
	name: string;
	uid: string;
	creationTimestamp: string;
	labels: Record<string, string>;
	annotations: Record<string, string>;
	ready: boolean;
	roles: string;
	podCIDR: string;
	taints: { key: string; value: string; effect: string }[];
	addresses: { type: string; address: string }[];
	capacity: Record<string, string>;
	allocatable: Record<string, string>;
	conditions: {
		type: string;
		status: string;
		reason: string;
		message: string;
		lastHeartbeatTime: string;
		lastTransitionTime: string;
	}[];
	nodeInfo: {
		architecture: string;
		bootID: string;
		containerRuntimeVersion: string;
		kernelVersion: string;
		kubeletVersion: string;
		machineID: string;
		operatingSystem: string;
		osImage: string;
	};
	images: { names: string[]; sizeBytes: number }[];
}

export interface PodListItem {
	name: string;
	namespace: string;
	status: string;
	statusClass: string;
	node: string;
	podIP: string;
	restarts: number;
}

export interface ContainerInfo {
	name: string;
	image: string;
	ports: { containerPort: number; protocol: string }[] | null;
	env: { name: string; value: string }[];
	volumeMounts: { name: string; mountPath: string; readOnly: boolean }[];
	resources: {
		requestsCpu: string;
		requestsMemory: string;
		limitsCpu: string;
		limitsMemory: string;
	};
	ready: boolean;
	restartCount: number;
	state: string;
	stateReason: string;
}

export interface PodDetails {
	name: string;
	namespace: string;
	uid: string;
	creationTimestamp: string;
	labels: Record<string, string> | null;
	annotations: Record<string, string> | null;
	status: string;
	statusClass: string;
	node: string;
	podIP: string;
	hostIP: string;
	qosClass: string;
	serviceAccount: string;
	containers: ContainerInfo[];
	initContainers: ContainerInfo[] | null;
	conditions: {
		type: string;
		status: string;
		reason: string;
		message: string;
		lastTransitionTime: string;
	}[];
	volumes: { name: string; type: string; source: string }[] | null;
	ownerReferences: { kind: string; name: string; uid: string }[] | null;
}

export interface ResourceFlavor {
	name: string;
	nodeLabels: Record<string, string>;
	nodeTaints: {
		effect: string;
		key: string;
		timeAdded: string;
		value: string;
	}[];
	tolerations: {
		effect: string;
		key: string;
		operator: string;
		value: string;
	}[];
}

export interface LocalQueue {
	name: string;
	namespace: string;
	clusterQueue: string;
	stopPolicy: string;
	pendingWorkloads: number;
	reservingWorkloads: number;
	admittedWorkloads: number;
}
