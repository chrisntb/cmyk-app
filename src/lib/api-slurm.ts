import type {
	Account,
	Association,
	Cluster,
	Diagnostic,
	Job,
	License,
	Node,
	Partition,
	QOS,
	Reservation,
	TRES,
	User,
	WCKey,
} from "../model/slurm";
import { fetchResource } from "./api";

const fetchSlurmResource = <T>(resource: string) =>
	fetchResource<T>(`slurm/${resource}`, `/slurm_${resource}.json`);

export const fetchSlurmJobs = () => fetchSlurmResource<Job[]>("jobs");
export const fetchSlurmNodes = () => fetchSlurmResource<Node[]>("nodes");
export const fetchSlurmPartitions = () =>
	fetchSlurmResource<Partition[]>("partitions");
export const fetchSlurmReservations = () =>
	fetchSlurmResource<Reservation[]>("reservations");
export const fetchSlurmDiagnostics = () =>
	fetchSlurmResource<Diagnostic[]>("diagnostics");
export const fetchSlurmAccounts = () =>
	fetchSlurmResource<Account[]>("accounts");
export const fetchSlurmClusters = () =>
	fetchSlurmResource<Cluster[]>("clusters");
export const fetchSlurmQos = () => fetchSlurmResource<QOS[]>("qos");
export const fetchSlurmUsers = () => fetchSlurmResource<User[]>("users");
export const fetchSlurmTres = () => fetchSlurmResource<TRES[]>("tres");
export const fetchSlurmWckeys = () => fetchSlurmResource<WCKey[]>("wckeys");
export const fetchSlurmAssociations = () =>
	fetchSlurmResource<Association[]>("associations");
export const fetchSlurmLicenses = () =>
	fetchSlurmResource<License[]>("licenses");
