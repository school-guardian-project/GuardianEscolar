export type RecordStatus = 'Active' | 'Inactive';
export type StatusFilter = RecordStatus | 'All';

export function statusOptions(records: readonly { status?: string }[]): StatusFilter[] {
  const active = records.some((record) => record.status !== 'Inactive');
  const inactive = records.some((record) => record.status === 'Inactive');
  return active && inactive ? ['Active', 'Inactive', 'All'] : inactive ? ['Inactive'] : ['Active'];
}

export function effectiveStatusFilter(filter: StatusFilter, options: readonly StatusFilter[]): StatusFilter {
  return options.includes(filter) ? filter : options[0];
}

export function matchesStatus(status: string | undefined, filter: StatusFilter): boolean {
  return filter === 'All' || (status === 'Inactive' ? 'Inactive' : 'Active') === filter;
}
