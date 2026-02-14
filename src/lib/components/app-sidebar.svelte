<script lang="ts">
import Activity from "@lucide/svelte/icons/activity";
import Award from "@lucide/svelte/icons/award";
import Box from "@lucide/svelte/icons/box";
import Briefcase from "@lucide/svelte/icons/briefcase";
import CalendarClock from "@lucide/svelte/icons/calendar-clock";
import ChevronRight from "@lucide/svelte/icons/chevron-right";
import Cpu from "@lucide/svelte/icons/cpu";
import Gauge from "@lucide/svelte/icons/gauge";
import Home from "@lucide/svelte/icons/home";
import Info from "@lucide/svelte/icons/info";
import Key from "@lucide/svelte/icons/key";
import Layers from "@lucide/svelte/icons/layers";
import LayoutGrid from "@lucide/svelte/icons/layout-grid";
import Link from "@lucide/svelte/icons/link";
import List from "@lucide/svelte/icons/list";
import Monitor from "@lucide/svelte/icons/monitor";
import Server from "@lucide/svelte/icons/server";
import Shield from "@lucide/svelte/icons/shield";
import UserCheck from "@lucide/svelte/icons/user-check";
import Users from "@lucide/svelte/icons/users";
import { Collapsible } from "bits-ui";
import { page } from "$app/state";
import * as Sidebar from "$lib/components/ui/sidebar/index.js";

const navItems = [
	{ title: "Home", href: "/", icon: Home },
	{ title: "About", href: "/about", icon: Info },
];

const clusterItems = [
	{ title: "Nodes", href: "/k8s/nodes", icon: Server },
	{ title: "Pods", href: "/k8s/pods", icon: Box },
	{ title: "Resource Flavors", href: "/k8s/resource-flavors", icon: Cpu },
	{ title: "Local Queues", href: "/k8s/local-queues", icon: List },
];

const slurmItems = [
	{ title: "Clusters", href: "/slurm/clusters", icon: Layers },
	{ title: "Diagnostics", href: "/slurm/diagnostics", icon: Activity },
	{ title: "Jobs", href: "/slurm/jobs", icon: Briefcase },
	{ title: "Nodes", href: "/slurm/nodes", icon: Monitor },
	{ title: "Partitions", href: "/slurm/partitions", icon: LayoutGrid },
	{ title: "Reservations", href: "/slurm/reservations", icon: CalendarClock },
];

const slurmSupportItems = [
	{ title: "Accounts", href: "/slurm/accounts", icon: Users },
	{ title: "Associations", href: "/slurm/associations", icon: Link },
	{ title: "Licenses", href: "/slurm/licenses", icon: Award },
	{ title: "QOS", href: "/slurm/qos", icon: Gauge },
	{ title: "TRES", href: "/slurm/tres", icon: Cpu },
	{ title: "Users", href: "/slurm/users", icon: UserCheck },
	{ title: "WCKeys", href: "/slurm/wckeys", icon: Key },
];
</script>

<Sidebar.Sidebar>
	<Sidebar.SidebarHeader>
		<Sidebar.SidebarMenu>
			<Sidebar.SidebarMenuItem>
				<Sidebar.SidebarMenuButton size="lg">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<div
								class="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<span class="text-lg font-bold">C</span>
							</div>
							<div class="flex flex-col gap-0.5 leading-none">
								<span class="font-semibold">CMYK</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.SidebarMenuButton>
			</Sidebar.SidebarMenuItem>
		</Sidebar.SidebarMenu>
	</Sidebar.SidebarHeader>
	<Sidebar.SidebarContent>
		<Sidebar.SidebarGroup>
			<Sidebar.SidebarGroupLabel>Navigation</Sidebar.SidebarGroupLabel>
			<Sidebar.SidebarGroupContent>
				<Sidebar.SidebarMenu>
					{#each navItems as item}
						<Sidebar.SidebarMenuItem>
							<Sidebar.SidebarMenuButton isActive={page.url.pathname === item.href}>
								{#snippet child({ props })}
									<a href={item.href} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.SidebarMenuButton>
						</Sidebar.SidebarMenuItem>
					{/each}
				</Sidebar.SidebarMenu>
			</Sidebar.SidebarGroupContent>
		</Sidebar.SidebarGroup>
		<Collapsible.Root open class="group/collapsible">
			<Sidebar.SidebarGroup>
				<Sidebar.SidebarGroupLabel>
					<Collapsible.Trigger
						class="flex w-full items-center justify-between [&[data-state=open]>svg]:rotate-90"
					>
						Kubernetes
						<ChevronRight
							class="ml-auto size-4 transition-transform duration-200"
						/>
					</Collapsible.Trigger>
				</Sidebar.SidebarGroupLabel>
				<Collapsible.Content>
					<Sidebar.SidebarGroupContent>
						<Sidebar.SidebarMenu>
							{#each clusterItems as item}
								<Sidebar.SidebarMenuItem>
									<Sidebar.SidebarMenuButton isActive={page.url.pathname === item.href}>
										{#snippet child({ props })}
											<a href={item.href} {...props}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.SidebarMenuButton>
								</Sidebar.SidebarMenuItem>
							{/each}
						</Sidebar.SidebarMenu>
					</Sidebar.SidebarGroupContent>
				</Collapsible.Content>
			</Sidebar.SidebarGroup>
		</Collapsible.Root>

		<Collapsible.Root open class="group/collapsible">
			<Sidebar.SidebarGroup>
				<Sidebar.SidebarGroupLabel>
					<Collapsible.Trigger
						class="flex w-full items-center justify-between [&[data-state=open]>svg]:rotate-90"
					>
						Slurm
						<ChevronRight
							class="ml-auto size-4 transition-transform duration-200"
						/>
					</Collapsible.Trigger>
				</Sidebar.SidebarGroupLabel>
				<Collapsible.Content>
					<Sidebar.SidebarGroupContent>
						<Sidebar.SidebarMenu>
							{#each slurmItems as item}
								<Sidebar.SidebarMenuItem>
									<Sidebar.SidebarMenuButton isActive={page.url.pathname === item.href}>
										{#snippet child({ props })}
											<a href={item.href} {...props}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.SidebarMenuButton>
								</Sidebar.SidebarMenuItem>
							{/each}
						</Sidebar.SidebarMenu>
					</Sidebar.SidebarGroupContent>
				</Collapsible.Content>
			</Sidebar.SidebarGroup>
		</Collapsible.Root>

		<Collapsible.Root open class="group/collapsible">
			<Sidebar.SidebarGroup>
				<Sidebar.SidebarGroupLabel>
					<Collapsible.Trigger
						class="flex w-full items-center justify-between [&[data-state=open]>svg]:rotate-90"
					>
						Slurm Support
						<ChevronRight
							class="ml-auto size-4 transition-transform duration-200"
						/>
					</Collapsible.Trigger>
				</Sidebar.SidebarGroupLabel>
				<Collapsible.Content>
					<Sidebar.SidebarGroupContent>
						<Sidebar.SidebarMenu>
							{#each slurmSupportItems as item}
								<Sidebar.SidebarMenuItem>
									<Sidebar.SidebarMenuButton isActive={page.url.pathname === item.href}>
										{#snippet child({ props })}
											<a href={item.href} {...props}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										{/snippet}
									</Sidebar.SidebarMenuButton>
								</Sidebar.SidebarMenuItem>
							{/each}
						</Sidebar.SidebarMenu>
					</Sidebar.SidebarGroupContent>
				</Collapsible.Content>
			</Sidebar.SidebarGroup>
		</Collapsible.Root>

	</Sidebar.SidebarContent>
	<Sidebar.SidebarFooter>
		<Sidebar.SidebarMenu>
			<Sidebar.SidebarMenuItem>
				<span class="text-muted-foreground px-2 py-1 text-xs">CMYK v1.0</span>
			</Sidebar.SidebarMenuItem>
		</Sidebar.SidebarMenu>
	</Sidebar.SidebarFooter>
	<Sidebar.SidebarRail />
</Sidebar.Sidebar>
