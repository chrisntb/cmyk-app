<script lang="ts">
import Activity from "@lucide/svelte/icons/activity";
import ArrowLeft from "@lucide/svelte/icons/arrow-left";
import Box from "@lucide/svelte/icons/box";
import CircleCheck from "@lucide/svelte/icons/circle-check";
import CircleX from "@lucide/svelte/icons/circle-x";
import FileText from "@lucide/svelte/icons/file-text";
import HardDrive from "@lucide/svelte/icons/hard-drive";
import Info from "@lucide/svelte/icons/info";
import Monitor from "@lucide/svelte/icons/monitor";
import Network from "@lucide/svelte/icons/network";
import Server from "@lucide/svelte/icons/server";
import ShieldAlert from "@lucide/svelte/icons/shield-alert";
import Tags from "@lucide/svelte/icons/tags";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { fetchK8sNodeDetails } from "$lib/api-k8s";
import * as Table from "$lib/components/ui/table/index.js";

interface Address {
	type: string;
	address: string;
}

interface Taint {
	key: string;
	value: string;
	effect: string;
}

interface Condition {
	type: string;
	status: string;
	reason: string;
	message: string;
	lastHeartbeatTime: string;
	lastTransitionTime: string;
}

interface NodeInfo {
	architecture: string;
	bootID: string;
	containerRuntimeVersion: string;
	kernelVersion: string;
	kubeletVersion: string;
	machineID: string;
	operatingSystem: string;
	osImage: string;
}

interface Image {
	names: string[];
	sizeBytes: number;
}

interface NodeDetails {
	name: string;
	uid: string;
	creationTimestamp: string;
	labels: Record<string, string>;
	annotations: Record<string, string>;
	ready: boolean;
	roles: string;
	podCIDR: string;
	taints: Taint[];
	addresses: Address[];
	capacity: Record<string, string>;
	allocatable: Record<string, string>;
	conditions: Condition[];
	nodeInfo: NodeInfo;
	images: Image[];
}

let node = $state<NodeDetails | null>(null);
let loading = $state(true);
let error = $state<string | null>(null);

function formatMemory(memory: string | undefined): string {
	if (!memory) return "-";
	const match = memory.match(/^(\d+)Ki$/);
	if (match) {
		const ki = parseInt(match[1], 10);
		const gi = ki / (1024 * 1024);
		return `${gi.toFixed(1)} Gi`;
	}
	return memory;
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 * 1024 * 1024)
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleString();
}

function getShortImageName(names: string[]): string {
	const taggedName = names.find((n) => !n.includes("@sha256:"));
	if (taggedName) return taggedName;
	return names[0]?.split("@")[0] ?? names[0] ?? "-";
}

async function fetchNodeDetails(name: string) {
	try {
		node = await fetchK8sNodeDetails(name);
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch node details";
	} finally {
		loading = false;
	}
}

$effect(() => {
	const name = page.params.name;
	if (name) {
		fetchNodeDetails(name);
	}
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-4">
		<a
			href={resolve('/k8s/nodes')}
			class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="size-4" />
			Back to Nodes
		</a>
	</div>

	{#if loading}
		<div class="text-muted-foreground">Loading node details...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else if node}
		<div class="flex items-center gap-3">
			<Server class="size-8 text-primary" />
			<h1 class="text-3xl font-bold tracking-tight">{node.name}</h1>
			{#if node.ready}
				<span
					class="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400"
				>
					<CircleCheck class="size-4" />
					Ready
				</span>
			{:else}
				<span
					class="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
				>
					<CircleX class="size-4" />
					Not Ready
				</span>
			{/if}
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
						<dd class="truncate font-mono text-xs">{node.uid}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Created</dt>
						<dd class="text-sm">{formatDate(node.creationTimestamp)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Roles</dt>
						<dd>
							{#if node.roles === '<none>'}
								<span class="text-muted-foreground">-</span>
							{:else}
								<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
									{node.roles}
								</span>
							{/if}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Pod CIDR</dt>
						<dd class="font-mono text-sm">{node.podCIDR ?? '-'}</dd>
					</div>
				</dl>
			</div>

			<!-- Node Info -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Monitor class="size-5 text-muted-foreground" />
					System Information
				</h2>
				{#if node.nodeInfo}
					<dl class="space-y-3">
						<div class="flex justify-between">
							<dt class="text-muted-foreground">OS</dt>
							<dd>{node.nodeInfo.osImage}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Architecture</dt>
							<dd>{node.nodeInfo.architecture}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Kernel</dt>
							<dd class="font-mono text-sm">{node.nodeInfo.kernelVersion}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Container Runtime</dt>
							<dd class="text-sm">{node.nodeInfo.containerRuntimeVersion}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Kubelet Version</dt>
							<dd>{node.nodeInfo.kubeletVersion}</dd>
						</div>
					</dl>
				{:else}
					<p class="text-muted-foreground">No system information available.</p>
				{/if}
			</div>

			<!-- Addresses -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Network class="size-5 text-muted-foreground" />
					Addresses
				</h2>
				{#if node.addresses?.length}
					<dl class="space-y-3">
						{#each node.addresses as addr (addr.type)}
							<div class="flex justify-between">
								<dt class="text-muted-foreground">{addr.type}</dt>
								<dd class="font-mono text-sm">{addr.address}</dd>
							</div>
						{/each}
					</dl>
				{:else}
					<p class="text-muted-foreground">No addresses available.</p>
				{/if}
			</div>

			<!-- Resources -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<HardDrive class="size-5 text-muted-foreground" />
					Resources
				</h2>
				<div class="space-y-4">
					{#if node.capacity}
						<div>
							<h3 class="mb-2 text-sm font-medium text-muted-foreground">Capacity</h3>
							<dl class="space-y-2">
								<div class="flex justify-between">
									<dt class="text-muted-foreground">CPU</dt>
									<dd class="font-medium">{node.capacity.cpu}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="text-muted-foreground">Memory</dt>
									<dd class="font-medium">{formatMemory(node.capacity.memory)}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="text-muted-foreground">Pods</dt>
									<dd class="font-medium">{node.capacity.pods}</dd>
								</div>
							</dl>
						</div>
					{/if}
					{#if node.allocatable}
						<div>
							<h3 class="mb-2 text-sm font-medium text-muted-foreground">Allocatable</h3>
							<dl class="space-y-2">
								<div class="flex justify-between">
									<dt class="text-muted-foreground">CPU</dt>
									<dd class="font-medium">{node.allocatable.cpu}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="text-muted-foreground">Memory</dt>
									<dd class="font-medium">{formatMemory(node.allocatable.memory)}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="text-muted-foreground">Pods</dt>
									<dd class="font-medium">{node.allocatable.pods}</dd>
								</div>
							</dl>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Conditions -->
		{#if node.conditions?.length}
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
								<Table.Head>Reason</Table.Head>
								<Table.Head class="hidden md:table-cell">Message</Table.Head>
								<Table.Head class="hidden lg:table-cell">Last Transition</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each node.conditions as condition (condition.type)}
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
									<Table.Cell class="text-sm">{condition.reason}</Table.Cell>
									<Table.Cell class="hidden max-w-xs truncate text-sm md:table-cell">
										{condition.message}
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

		<!-- Taints -->
		{#if node.taints?.length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<ShieldAlert class="size-5 text-muted-foreground" />
					Taints
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each node.taints as taint (taint.key)}
						<span class="rounded-md bg-orange-100 px-2 py-1 text-sm dark:bg-orange-900/30">
							<span class="font-medium">{taint.key}</span>
							{#if taint.value}={taint.value}{/if}
							<span class="text-muted-foreground">:{taint.effect}</span>
						</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Labels -->
		{#if node.labels && Object.keys(node.labels).length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Tags class="size-5 text-muted-foreground" />
					Labels
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each Object.entries(node.labels) as [key, value] (key)}
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
		{#if node.annotations && Object.keys(node.annotations).length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<FileText class="size-5 text-muted-foreground" />
					Annotations
				</h2>
				<dl class="space-y-2">
					{#each Object.entries(node.annotations) as [key, value] (key)}
						<div class="text-sm">
							<dt class="font-medium text-muted-foreground">{key}</dt>
							<dd class="mt-0.5 font-mono text-xs break-all">{value}</dd>
						</div>
					{/each}
				</dl>
			</div>
		{/if}

		<!-- Images -->
		{#if node.images?.length}
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Box class="size-5 text-muted-foreground" />
					Images ({node.images.length})
				</h2>
				<div class="rounded-md border">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Image</Table.Head>
								<Table.Head class="text-right">Size</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each node.images as image (image.names[0])}
								<Table.Row>
									<Table.Cell class="font-mono text-sm">{getShortImageName(image.names)}</Table.Cell
									>
									<Table.Cell class="text-right text-muted-foreground"
										>{formatBytes(image.sizeBytes)}</Table.Cell
									>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</div>
		{/if}
	{:else}
		<div class="text-muted-foreground">Node not found.</div>
	{/if}
</div>
