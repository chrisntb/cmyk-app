<script lang="ts">
import Info from "@lucide/svelte/icons/info";
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Info class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">About</h1>
	</div>

	<p class="text-muted-foreground">
		See <a
			href="https://github.com/chrisntb/cmyk"
			target="_blank"
			class="text-primary underline underline-offset-4 hover:text-primary/80">https://github.com/chrisntb/cmyk</a>.
	</p>

	<p class="text-muted-foreground">The following technologies are used.</p>

	<div class="space-y-4">
		<h2 class="text-l font-semibold">Service</h2>
		<ul class="list-inside list-disc space-y-1 text-muted-foreground">
			<li>Go</li>
			<li>Go Fiber</li>
			<li>Postgres</li>
		</ul>

		<h2 class="text-l font-semibold">Infrastructure</h2>
		<ul class="list-inside list-disc space-y-1 text-muted-foreground">
			<li>Kubernetes 1.35 with Flannel networking and Kueue job admission and placement logic</li>
			<li>Slurm mock <a href="https://slurm.schedmd.com/rest_api.html" target="_blank" class="text-primary underline underline-offset-4 hover:text-primary/80">https://slurm.schedmd.com/rest_api.html</a></li>
			<li>Canonical Multipass nodes for development</li>
			<li>No production nodes 🚫💰😭</li>
			<li>Ansible Playbooks</li>
		</ul>

		<h2 class="text-l font-semibold">Website</h2>
		<ul class="list-inside list-disc space-y-1 text-muted-foreground">
			<li>Svelte 5 with runes</li>
			<li>SvelteKit for routing</li>
			<li>TypeScript for type safety</li>
			<li>Tailwind CSS for styling</li>
			<li>shadcn-svelte for UI components</li>
		</ul>
	</div>
</div>
