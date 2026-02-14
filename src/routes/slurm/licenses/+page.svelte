<script lang="ts">
import Award from "@lucide/svelte/icons/award";
import { fetchSlurmLicenses } from "$lib/api-slurm";
import { Badge } from "$lib/components/ui/badge/index.js";
import * as Table from "$lib/components/ui/table/index.js";

interface License {
	name: string;
	total: number;
	used: number;
	free: number;
	remote: boolean;
}

let licenses = $state<License[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmLicenses()
		.then((data) => (licenses = data))
		.catch(
			(e) =>
				(error = e instanceof Error ? e.message : "Failed to fetch licenses"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Award class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Licenses</h1>
	</div>
	<p class="text-muted-foreground">Tracked software licenses and their availability.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading licenses...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head class="text-right">Total</Table.Head>
						<Table.Head class="text-right">Used</Table.Head>
						<Table.Head class="text-right">Free</Table.Head>
						<Table.Head>Remote</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each licenses as lic (lic.name)}
						<Table.Row>
							<Table.Cell class="font-medium">{lic.name}</Table.Cell>
							<Table.Cell class="text-right">{lic.total}</Table.Cell>
							<Table.Cell class="text-right">{lic.used}</Table.Cell>
							<Table.Cell class="text-right">{lic.free}</Table.Cell>
							<Table.Cell
								><Badge variant={lic.remote ? 'outline' : 'secondary'}
									>{lic.remote ? 'Yes' : 'No'}</Badge
								></Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
