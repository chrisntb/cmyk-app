<script lang="ts">
import Cpu from "@lucide/svelte/icons/cpu";
import { resolve } from "$app/paths";
import { fetchK8sResourceFlavors } from "$lib/api-k8s";
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

let flavors = $state<ResourceFlavor[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

async function fetchFlavors() {
	try {
		flavors = await fetchK8sResourceFlavors();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch resource flavors";
	} finally {
		loading = false;
	}
}

$effect(() => {
	fetchFlavors();
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Cpu class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Resource Flavors</h1>
	</div>
	<p class="text-muted-foreground">Available resource flavors and their configurations.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading resource flavors...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Node Labels</Table.Head>
						<Table.Head>Node Taints</Table.Head>
						<Table.Head>Tolerations</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each flavors as flavor (flavor.name)}
						<Table.Row>
							<Table.Cell class="font-medium">
								<a
									href={resolve(`/k8s/resource-flavors/${flavor.name}`)}
									class="text-primary hover:underline"
								>
									{flavor.name}
								</a>
							</Table.Cell>
							<Table.Cell>
								<div class="flex flex-wrap gap-1">
									{#each Object.entries(flavor.nodeLabels ?? {}) as [key, value] (key)}
										<span
											class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
										>
											{key}={value}
										</span>
									{/each}
									{#if !flavor.nodeLabels || Object.keys(flavor.nodeLabels).length === 0}
										<span class="text-muted-foreground">-</span>
									{/if}
								</div>
							</Table.Cell>
							<Table.Cell>
								{#if flavor.nodeTaints?.length}
									<div class="flex flex-wrap gap-1">
										{#each flavor.nodeTaints as taint (taint.key)}
											<span
												class="rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400"
											>
												{taint.key}:{taint.effect}
											</span>
										{/each}
									</div>
								{:else}
									<span class="text-muted-foreground">-</span>
								{/if}
							</Table.Cell>
							<Table.Cell>
								{#if flavor.tolerations?.length}
									<div class="flex flex-wrap gap-1">
										{#each flavor.tolerations as toleration (toleration.key)}
											<span
												class="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400"
											>
												{toleration.key}:{toleration.effect}
											</span>
										{/each}
									</div>
								{:else}
									<span class="text-muted-foreground">-</span>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
