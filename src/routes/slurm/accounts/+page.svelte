<script lang="ts">
import Users from "@lucide/svelte/icons/users";
import { fetchSlurmAccounts } from "$lib/api-slurm";
import * as Table from "$lib/components/ui/table/index.js";

interface Account {
	name: string;
	description: string;
	organization: string;
	coordinators: string[];
	default_qos: string;
}

let accounts = $state<Account[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmAccounts()
		.then((data) => (accounts = data))
		.catch(
			(e) =>
				(error = e instanceof Error ? e.message : "Failed to fetch accounts"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Users class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Accounts</h1>
	</div>
	<p class="text-muted-foreground">Slurm accounting database accounts.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading accounts...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Description</Table.Head>
						<Table.Head>Organization</Table.Head>
						<Table.Head>Coordinators</Table.Head>
						<Table.Head>Default QOS</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each accounts as account (account.name)}
						<Table.Row>
							<Table.Cell class="font-medium">{account.name}</Table.Cell>
							<Table.Cell>{account.description}</Table.Cell>
							<Table.Cell>{account.organization}</Table.Cell>
							<Table.Cell>{account.coordinators.join(', ')}</Table.Cell>
							<Table.Cell class="font-mono">{account.default_qos}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
