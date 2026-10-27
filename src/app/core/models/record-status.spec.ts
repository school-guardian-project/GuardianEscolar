import { effectiveStatusFilter, matchesStatus, statusOptions } from './record-status';

describe('record status filters', () => {
  it('only offers states present in the complete dataset', () => {
    expect(statusOptions([{ status: 'Active' }])).toEqual(['Active']);
    expect(statusOptions([{ status: 'Inactive' }])).toEqual(['Inactive']);
    expect(statusOptions([{ status: 'Active' }, { status: 'Inactive' }])).toEqual(['Active', 'Inactive', 'All']);
    expect(statusOptions([])).toEqual(['Active']);
  });

  it('falls back to the remaining state after reactivation and supports older active records', () => {
    expect(effectiveStatusFilter('Inactive', ['Active'])).toBe('Active');
    expect(effectiveStatusFilter('Active', ['Inactive'])).toBe('Inactive');
    expect(matchesStatus(undefined, 'Active')).toBe(true);
    expect(matchesStatus('Inactive', 'All')).toBe(true);
  });
});
