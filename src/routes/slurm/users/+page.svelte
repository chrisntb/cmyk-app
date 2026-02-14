<script lang="ts">
import UserCheck from "@lucide/svelte/icons/user-check";
import { fetchSlurmUsers } from "$lib/api-slurm";
import { Badge } from "$lib/components/ui/badge/index.js";
import * as Table from "$lib/components/ui/table/index.js";

interface User {
	name: string;
	default_account: string;
	admin_level: string;
	accounts: string[];
}

let users = $state<User[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmUsers()
		.then((data) => (users = data))
		.catch(
			(e) => (error = e instanceof Error ? e.message : "Failed to fetch users"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<UserCheck class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Users</h1>
	</div>
	<p class="text-muted-foreground">Slurm database user accounts.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading users...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Default Account</Table.Head>
						<Table.Head>Admin Level</Table.Head>
						<Table.Head>Accounts</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each users as user (user.name)}
						<Table.Row>
							<Table.Cell class="font-medium">{user.name}</Table.Cell>
							<Table.Cell class="font-mono">{user.default_account}</Table.Cell>
							<Table.Cell>
								<Badge
									variant={user.admin_level === 'Administrator'
										? 'default'
										: user.admin_level === 'Operator'
											? 'outline'
											: 'secondary'}
								>
									{user.admin_level}
								</Badge>
							</Table.Cell>
							<Table.Cell>{user.accounts.join(', ')}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
