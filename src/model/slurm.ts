export interface Job {
	job_id: number;
	name: string;
	user_name: string;
	partition: string;
	job_state: string;
	node_count: number;
	cpus: number;
	time_limit: string;
}

export interface Node {
	name: string;
	state: string;
	cpus: number;
	alloc_cpus: number;
	real_memory: number;
	alloc_memory: number;
	partitions: string[];
	architecture: string;
}

export interface Partition {
	name: string;
	state: string;
	total_nodes: number;
	total_cpus: number;
	max_time: string;
	default_time: string;
	allow_groups: string;
	nodes: string;
}

export interface Reservation {
	name: string;
	users: string;
	accounts: string;
	partition: string;
	node_count: number;
	start_time: string;
	end_time: string;
	state: string;
}

export interface Diagnostic {
	key: string;
	value: string;
}

export interface Account {
	name: string;
	description: string;
	organization: string;
	coordinators: string[];
	default_qos: string;
}

export interface Cluster {
	name: string;
	control_host: string;
	control_port: number;
	nodes: string;
	rpc_version: number;
	tres: string;
}

export interface QOS {
	name: string;
	description: string;
	priority: number;
	max_jobs_per_user: number;
	max_tres_per_user: string;
	max_wall_clock: string;
	preempt_mode: string;
}

export interface User {
	name: string;
	default_account: string;
	admin_level: string;
	accounts: string[];
}

export interface TRES {
	type: string;
	name: string;
	id: number;
	count: number;
}

export interface WCKey {
	id: number;
	name: string;
	user: string;
	cluster: string;
}

export interface Association {
	id: number;
	account: string;
	user: string;
	cluster: string;
	partition: string;
	qos: string[];
	default_qos: string;
}

export interface License {
	name: string;
	total: number;
	used: number;
	free: number;
	remote: boolean;
}
