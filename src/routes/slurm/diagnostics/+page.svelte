<script lang="ts">
import Activity from "@lucide/svelte/icons/activity";
import { fetchSlurmDiagnostics } from "$lib/api-slurm";
import * as Table from "$lib/components/ui/table/index.js";

interface Diagnostic {
	key: string;
	value: string;
}

let diagnostics = $state<Diagnostic[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmDiagnostics()
		.then((data) => (diagnostics = data))
		.catch(
			(e) =>
				(error =
					e instanceof Error ? e.message : "Failed to fetch diagnostics"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Activity class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Diagnostics</h1>
	</div>
	<p class="text-muted-foreground">Slurm controller diagnostics and statistics.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading diagnostics...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Metric</Table.Head>
						<Table.Head>Value</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each diagnostics as diag (diag.key)}
						<Table.Row>
							<Table.Cell class="font-medium">{diag.key}</Table.Cell>
							<Table.Cell class="font-mono">{diag.value}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
