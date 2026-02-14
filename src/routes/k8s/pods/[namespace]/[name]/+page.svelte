<script lang="ts">
import Activity from "@lucide/svelte/icons/activity";
import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
import ArrowLeft from "@lucide/svelte/icons/arrow-left";
import Box from "@lucide/svelte/icons/box";
import CircleCheck from "@lucide/svelte/icons/circle-check";
import CircleDashed from "@lucide/svelte/icons/circle-dashed";
import CircleX from "@lucide/svelte/icons/circle-x";
import Clock from "@lucide/svelte/icons/clock";
import Container from "@lucide/svelte/icons/container";
import FileText from "@lucide/svelte/icons/file-text";
import HardDrive from "@lucide/svelte/icons/hard-drive";
import Info from "@lucide/svelte/icons/info";
import Link from "@lucide/svelte/icons/link";
import Play from "@lucide/svelte/icons/play";
import Tags from "@lucide/svelte/icons/tags";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { fetchK8sPodDetails } from "$lib/api-k8s";
import * as Table from "$lib/components/ui/table/index.js";

interface ContainerResource {
	requestsCpu: string;
	requestsMemory: string;
	limitsCpu: string;
	limitsMemory: string;
}

interface VolumeMount {
	name: string;
	mountPath: string;
	readOnly: boolean;
}

interface EnvVar {
	name: string;
	value: string;
}

interface ContainerInfo {
	name: string;
	image: string;
	ports: { containerPort: number; protocol: string }[] | null;
	env: EnvVar[] | null;
	volumeMounts: VolumeMount[] | null;
	resources: ContainerResource;
	ready: boolean;
	restartCount: number;
	state: string;
	stateReason: string;
}

interface Condition {
	type: string;
	status: string;
	reason: string;
	message: string;
	lastTransitionTime: string;
}

interface Volume {
	name: string;
	type: string;
	source: string;
}

interface OwnerReference {
	kind: string;
	name: string;
	uid: string;
}

interface PodDetails {
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
	conditions: Condition[];
	volumes: Volume[] | null;
	ownerReferences: OwnerReference[] | null;
}

let pod = $state<PodDetails | null>(null);
let loading = $state(true);
let error = $state<string | null>(null);

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleString();
}

function getStatusIcon(statusClass: string) {
	switch (statusClass) {
		case "running":
			return { icon: CircleCheck, class: "text-green-600 dark:text-green-400" };
		case "pending":
			return { icon: Clock, class: "text-yellow-600 dark:text-yellow-400" };
		case "succeeded":
			return { icon: CircleCheck, class: "text-blue-600 dark:text-blue-400" };
		case "failed":
			return { icon: CircleX, class: "text-red-600 dark:text-red-400" };
		case "unknown":
			return {
				icon: AlertTriangle,
				class: "text-orange-600 dark:text-orange-400",
			};
		default:
			return { icon: CircleDashed, class: "text-muted-foreground" };
	}
}

function getContainerStateClass(state: string): string {
	switch (state.toLowerCase()) {
		case "running":
			return "text-green-600 dark:text-green-400";
		case "terminated":
			return "text-blue-600 dark:text-blue-400";
		case "waiting":
			return "text-yellow-600 dark:text-yellow-400";
		default:
			return "text-muted-foreground";
	}
}

async function fetchPodDetails(namespace: string, name: string) {
	try {
		pod = await fetchK8sPodDetails(namespace, name);
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch pod details";
	} finally {
		loading = false;
	}
}

$effect(() => {
	const namespace = page.params.namespace;
	const name = page.params.name;
	if (namespace && name) {
		fetchPodDetails(namespace, name);
	}
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-4">
		<a
			href={resolve('/k8s/pods')}
			class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="size-4" />
			Back to Pods
		</a>
	</div>

	{#if loading}
		<div class="text-muted-foreground">Loading pod details...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else if pod}
		{@const statusInfo = getStatusIcon(pod.statusClass)}
		<div class="flex items-center gap-3">
			<Box class="size-8 text-primary" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight">{pod.name}</h1>
				<span class="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
					{pod.namespace}
				</span>
			</div>
			<span
				class="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm {statusInfo.class} {pod.statusClass ===
				'running'
					? 'bg-green-100 dark:bg-green-900/30'
					: pod.statusClass === 'failed'
						? 'bg-red-100 dark:bg-red-900/30'
						: 'bg-secondary'}"
			>
				<statusInfo.icon class="size-4" />
				{pod.status}
			</span>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Basic Information -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Info class="size-5 text-muted-foreground" />
					Basic Information
				</h2>
				<dl class="space-y-3">
					<div class="flex justify-between gap-4">
						<dt class="text-muted-foreground">UID</dt>
						<dd class="truncate font-mono text-xs">{pod.uid}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Created</dt>
						<dd class="text-sm">{formatDate(pod.creationTimestamp)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Node</dt>
						<dd>
							<a href={resolve(`/k8s/nodes/${pod.node}`)} class="text-primary hover:underline"
								>{pod.node}</a
							>
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Pod IP</dt>
						<dd class="font-mono text-sm">{pod.podIP ?? '-'}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Host IP</dt>
						<dd class="font-mono text-sm">{pod.hostIP ?? '-'}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">QoS Class</dt>
						<dd>{pod.qosClass ?? '-'}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Service Account</dt>
						<dd>{pod.serviceAccount ?? '-'}</dd>
					</div>
				</dl>
			</div>

			<!-- Owner References -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Link class="size-5 text-muted-foreground" />
					Owner References
				</h2>
				{#if pod.ownerReferences?.length}
					<dl class="space-y-3">
						{#each pod.ownerReferences as owner (owner.uid)}
							<div class="flex justify-between">
								<dt class="text-muted-foreground">{owner.kind}</dt>
								<dd class="font-medium">{owner.name}</dd>
							</div>
						{/each}
					</dl>
				{:else}
					<p class="text-muted-foreground">No owner references.</p>
				{/if}
			</div>
		</div>

		<!-- Conditions -->
		{#if pod.conditions?.length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Activity class="size-5 text-muted-foreground" />
					Conditions
				</h2>
				<div class="rounded-md border">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Type</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head class="hidden md:table-cell">Reason</Table.Head>
								<Table.Head class="hidden lg:table-cell">Last Transition</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each pod.conditions as condition (condition.type)}
								<Table.Row>
									<Table.Cell class="font-medium">{condition.type}</Table.Cell>
									<Table.Cell>
										{#if condition.status === 'True'}
											<span
												class="inline-flex items-center gap-1 text-green-600 dark:text-green-400"
											>
												<CircleCheck class="size-3.5" />
												True
											</span>
										{:else}
											<span class="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
												<CircleX class="size-3.5" />
												False
											</span>
										{/if}
									</Table.Cell>
									<Table.Cell class="hidden text-sm md:table-cell">
										{condition.reason || '-'}
									</Table.Cell>
									<Table.Cell class="hidden text-sm text-muted-foreground lg:table-cell">
										{formatDate(condition.lastTransitionTime)}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</div>
		{/if}

		<!-- Containers -->
		{#if pod.containers?.length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Container class="size-5 text-muted-foreground" />
					Containers ({pod.containers.length})
				</h2>
				<div class="space-y-4">
					{#each pod.containers as container (container.name)}
						<div class="rounded-lg border p-4">
							<div class="mb-3 flex items-center justify-between">
								<h3 class="font-semibold">{container.name}</h3>
								<div class="flex items-center gap-2">
									<span class={getContainerStateClass(container.state)}>
										{container.state}
										{#if container.stateReason}({container.stateReason}){/if}
									</span>
									{#if container.ready}
										<span
											class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400"
											>Ready</span
										>
									{:else}
										<span
											class="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400"
											>Not Ready</span
										>
									{/if}
								</div>
							</div>
							<dl class="grid gap-2 text-sm md:grid-cols-2">
								<div>
									<dt class="text-muted-foreground">Image</dt>
									<dd class="truncate font-mono text-xs" title={container.image}>
										{container.image}
									</dd>
								</div>
								<div>
									<dt class="text-muted-foreground">Restarts</dt>
									<dd
										class={container.restartCount > 0 ? 'text-orange-600 dark:text-orange-400' : ''}
									>
										{container.restartCount}
									</dd>
								</div>
								{#if container.resources}
									<div>
										<dt class="text-muted-foreground">Requests</dt>
										<dd>
											{#if container.resources.requestsCpu || container.resources.requestsMemory}
												{container.resources.requestsCpu || '-'} CPU, {container.resources
													.requestsMemory || '-'} Memory
											{:else}
												-
											{/if}
										</dd>
									</div>
									<div>
										<dt class="text-muted-foreground">Limits</dt>
										<dd>
											{#if container.resources.limitsCpu || container.resources.limitsMemory}
												{container.resources.limitsCpu || '-'} CPU, {container.resources
													.limitsMemory || '-'} Memory
											{:else}
												-
											{/if}
										</dd>
									</div>
								{/if}
							</dl>
							{#if container.ports?.length}
								<div class="mt-3">
									<dt class="text-sm text-muted-foreground">Ports</dt>
									<dd class="mt-1 flex flex-wrap gap-2">
										{#each container.ports as port (port.containerPort + '/' + port.protocol)}
											<span class="rounded bg-secondary px-2 py-0.5 text-xs">
												{port.containerPort}/{port.protocol}
											</span>
										{/each}
									</dd>
								</div>
							{/if}
							{#if container.env?.length}
								<details class="mt-3">
									<summary
										class="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
										>Environment Variables ({container.env.length})</summary
									>
									<div class="mt-2 space-y-1">
										{#each container.env as env (env.name)}
											<div class="text-xs">
												<span class="font-medium">{env.name}</span>
												{#if env.value}
													<span class="text-muted-foreground">={env.value}</span>
												{/if}
											</div>
										{/each}
									</div>
								</details>
							{/if}
							{#if container.volumeMounts?.length}
								<details class="mt-3">
									<summary
										class="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
										>Volume Mounts ({container.volumeMounts.length})</summary
									>
									<div class="mt-2 space-y-1">
										{#each container.volumeMounts as mount (mount.name)}
											<div class="text-xs">
												<span class="font-medium">{mount.name}</span>
												<span class="text-muted-foreground">
													→ {mount.mountPath}
													{#if mount.readOnly}(ro){/if}
												</span>
											</div>
										{/each}
									</div>
								</details>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Init Containers -->
		{#if pod.initContainers?.length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Play class="size-5 text-muted-foreground" />
					Init Containers ({pod.initContainers.length})
				</h2>
				<div class="space-y-4">
					{#each pod.initContainers as container (container.name)}
						<div class="rounded-lg border p-4">
							<div class="mb-3 flex items-center justify-between">
								<h3 class="font-semibold">{container.name}</h3>
								<span class={getContainerStateClass(container.state)}>
									{container.state}
									{#if container.stateReason}({container.stateReason}){/if}
								</span>
							</div>
							<dl class="grid gap-2 text-sm md:grid-cols-2">
								<div>
									<dt class="text-muted-foreground">Image</dt>
									<dd class="truncate font-mono text-xs" title={container.image}>
										{container.image}
									</dd>
								</div>
								<div>
									<dt class="text-muted-foreground">Restarts</dt>
									<dd>{container.restartCount}</dd>
								</div>
							</dl>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Volumes -->
		{#if pod.volumes?.length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<HardDrive class="size-5 text-muted-foreground" />
					Volumes ({pod.volumes.length})
				</h2>
				<div class="rounded-md border">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-1/5">Name</Table.Head>
								<Table.Head>Type</Table.Head>
								<Table.Head>Source</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each pod.volumes as volume (volume.name)}
								<Table.Row>
									<Table.Cell class="font-medium">{volume.name}</Table.Cell>
									<Table.Cell>
										<span class="rounded bg-secondary px-2 py-0.5 text-xs">{volume.type}</span>
									</Table.Cell>
									<Table.Cell class="font-mono text-sm text-muted-foreground">
										{volume.source}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</div>
		{/if}

		<!-- Labels -->
		{#if pod.labels && Object.keys(pod.labels).length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Tags class="size-5 text-muted-foreground" />
					Labels
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each Object.entries(pod.labels) as [key, value] (key)}
						<span
							class="rounded-md bg-secondary px-2 py-1 text-sm"
							title={value ? `${key}=${value}` : key}
						>
							<span class="font-medium">{key}</span>
							{#if value}<span class="text-muted-foreground">={value}</span>{/if}
						</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Annotations -->
		{#if pod.annotations && Object.keys(pod.annotations).length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<FileText class="size-5 text-muted-foreground" />
					Annotations
				</h2>
				<dl class="space-y-2">
					{#each Object.entries(pod.annotations) as [key, value] (key)}
						<div class="text-sm">
							<dt class="font-medium text-muted-foreground">{key}</dt>
							<dd class="mt-0.5 font-mono text-xs break-all">{value}</dd>
						</div>
					{/each}
				</dl>
			</div>
		{/if}
	{:else}
		<div class="text-muted-foreground">Pod not found.</div>
	{/if}
</div>
