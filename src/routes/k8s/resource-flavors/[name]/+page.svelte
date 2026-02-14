<script lang="ts">
import ArrowLeft from "@lucide/svelte/icons/arrow-left";
import Cpu from "@lucide/svelte/icons/cpu";
import Shield from "@lucide/svelte/icons/shield";
import ShieldAlert from "@lucide/svelte/icons/shield-alert";
import Tags from "@lucide/svelte/icons/tags";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { fetchK8sResourceFlavorDetails } from "$lib/api-k8s";
import * as Table from "$lib/components/ui/table/index.js";

interface NodeTaint {
	effect: string;
	key: string;
	timeAdded: string;
	value: string;
}

interface Toleration {
	effect: string;
	key: string;
	operator: string;
	value: string;
}

interface ResourceFlavor {
	name: string;
	nodeLabels: Record<string, string>;
	nodeTaints: NodeTaint[];
	tolerations: Toleration[];
}

let flavor = $state<ResourceFlavor | null>(null);
let loading = $state(true);
let error = $state<string | null>(null);

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleString();
}

async function fetchFlavor(name: string) {
	try {
		flavor = await fetchK8sResourceFlavorDetails(name);
	} catch (e) {
		error =
			e instanceof Error
				? e.message
				: "Failed to fetch resource flavor details";
	} finally {
		loading = false;
	}
}

$effect(() => {
	const name = page.params.name;
	if (name) {
		fetchFlavor(name);
	}
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-4">
		<a
			href={resolve('/k8s/resource-flavors')}
			class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="size-4" />
			Back to Resource Flavors
		</a>
	</div>

	{#if loading}
		<div class="text-muted-foreground">Loading resource flavor details...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else if flavor}
		<div class="flex items-center gap-3">
			<Cpu class="size-8 text-primary" />
			<h1 class="text-3xl font-bold tracking-tight">{flavor.name}</h1>
		</div>

		<!-- Node Labels -->
		<div class="rounded-lg border bg-card p-6">
			<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
				<Tags class="size-5 text-muted-foreground" />
				Node Labels
			</h2>
			{#if flavor.nodeLabels && Object.keys(flavor.nodeLabels).length}
				<div class="flex flex-wrap gap-2">
					{#each Object.entries(flavor.nodeLabels) as [key, value] (key)}
						<span class="rounded-md bg-secondary px-2 py-1 text-sm">
							<span class="font-medium">{key}</span>
							{#if value}<span class="text-muted-foreground">={value}</span>{/if}
						</span>
					{/each}
				</div>
			{:else}
				<p class="text-muted-foreground">No node labels configured.</p>
			{/if}
		</div>

		<!-- Node Taints -->
		<div class="rounded-lg border bg-card p-6">
			<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
				<ShieldAlert class="size-5 text-muted-foreground" />
				Node Taints
			</h2>
			{#if flavor.nodeTaints?.length}
				<div class="rounded-md border">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Key</Table.Head>
								<Table.Head>Value</Table.Head>
								<Table.Head>Effect</Table.Head>
								<Table.Head class="hidden md:table-cell">Time Added</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each flavor.nodeTaints as taint (taint.key)}
								<Table.Row>
									<Table.Cell class="font-mono text-sm font-medium">{taint.key}</Table.Cell>
									<Table.Cell class="text-sm">{taint.value}</Table.Cell>
									<Table.Cell>
										<span
											class="rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400"
										>
											{taint.effect}
										</span>
									</Table.Cell>
									<Table.Cell class="hidden text-sm text-muted-foreground md:table-cell">
										{taint.timeAdded ? formatDate(taint.timeAdded) : '-'}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			{:else}
				<p class="text-muted-foreground">No node taints configured.</p>
			{/if}
		</div>

		<!-- Tolerations -->
		<div class="rounded-lg border bg-card p-6">
			<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
				<Shield class="size-5 text-muted-foreground" />
				Tolerations
			</h2>
			{#if flavor.tolerations?.length}
				<div class="rounded-md border">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Key</Table.Head>
								<Table.Head>Operator</Table.Head>
								<Table.Head>Value</Table.Head>
								<Table.Head>Effect</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each flavor.tolerations as toleration (toleration.key)}
								<Table.Row>
									<Table.Cell class="font-mono text-sm font-medium">{toleration.key}</Table.Cell>
									<Table.Cell class="text-sm">{toleration.operator}</Table.Cell>
									<Table.Cell class="text-sm">{toleration.value}</Table.Cell>
									<Table.Cell>
										<span
											class="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400"
										>
											{toleration.effect}
										</span>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			{:else}
				<p class="text-muted-foreground">No tolerations configured.</p>
			{/if}
		</div>
	{:else}
		<div class="text-muted-foreground">Resource flavor not found.</div>
	{/if}
</div>
