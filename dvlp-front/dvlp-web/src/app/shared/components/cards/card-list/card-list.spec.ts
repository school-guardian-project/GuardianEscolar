import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardList } from './card-list';
import { TranslateModule } from '@ngx-translate/core';

describe('CardList', () => {
  let component: CardList;
  let fixture: ComponentFixture<CardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardList, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters schools by available status independently of search and replaces deletion with reactivation', () => {
    fixture.componentRef.setInput('type', 'schools');
    fixture.componentRef.setInput('statusFilterEnabled', true);
    fixture.componentRef.setInput('data', [
      { id: 'active', name: 'Active school', status: 'Active' },
      { id: 'inactive', name: 'Closed school', status: 'Inactive' },
    ]);
    fixture.detectChanges();
    expect(component.filteredItems.map(item => item.id)).toEqual(['active']);
    const selector: HTMLSelectElement = fixture.nativeElement.querySelector('.card-list__status-filter');
    expect(selector.options.length).toBe(3);
    expect(selector.compareDocumentPosition(fixture.nativeElement.querySelector('input')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    component.changeStatusFilter('Inactive');
    fixture.detectChanges();
    expect(component.filteredItems.map(item => item.id)).toEqual(['inactive']);
    expect(fixture.nativeElement.querySelector('button[title="Eliminar"]')).toBeNull();
    const reactivate = vi.fn();
    component.reactivateItem.subscribe(reactivate);
    fixture.nativeElement.querySelector('.card-list__actions button').click();
    expect(reactivate).toHaveBeenCalledWith(expect.objectContaining({ id: 'inactive' }));
    component.changeStatusFilter('All');
    component.onSearchChange('Closed');
    fixture.detectChanges();
    expect(component.filteredItems).toHaveLength(1);
    expect(component.statusOptions).toEqual(['Active', 'Inactive', 'All']);
    expect(component.currentPage).toBe(1);
  });

  it('hides school status selectors when one state exists and updates after the last reactivation', () => {
    fixture.componentRef.setInput('type', 'schools');
    fixture.componentRef.setInput('statusFilterEnabled', true);
    fixture.componentRef.setInput('data', [{ id: '1', name: 'School', status: 'Inactive' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.card-list__status-filter')).toBeNull();
    expect(component.filteredItems).toHaveLength(1);
    component.changeStatusFilter('Inactive');
    fixture.componentRef.setInput('data', [{ id: '1', name: 'School', status: 'Active' }]);
    fixture.detectChanges();
    expect(component.selectedStatus).toBe('Active');
    expect(component.filteredItems).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('button[title="Eliminar"]')).not.toBeNull();
  });

  it('displays the administrator full name without changing the action payload', () => {
    const admin = { id: 'admin-1', name: 'Maria Elena', lastName: 'Perez Gomez', fullName: 'Maria Elena Perez Gomez' };
    fixture.componentRef.setInput('type', 'admins');
    fixture.componentRef.setInput('data', [admin]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-list__name').textContent.trim()).toBe(admin.fullName);
    const edit = vi.fn();
    component.editItem.subscribe(edit);
    fixture.nativeElement.querySelector('button[title="Editar"]').click();
    expect(edit).toHaveBeenCalledWith(admin);
  });

  it('displays configured route workdays', () => {
    fixture.componentRef.setInput('type', 'route');
    fixture.componentRef.setInput('data', [{
      id: 'route-1',
      name: 'Morning route',
      destination: 'North sector',
      startTime: '07:00',
      endTime: '08:00',
      daysOfWeek: ['Monday', 'Wednesday'],
    }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-list__info').textContent)
      .toContain('Monday, Wednesday');
  });

  function setRecords(count: number): void {
    fixture.componentRef.setInput('data', Array.from({ length: count }, (_, index) => ({
      id: `record-${index + 1}`, name: `User ${index + 1}`,
    })));
    fixture.detectChanges();
  }

  it('renders ten records and preserves the full total with two synchronized pagers', () => {
    setRecords(23);
    expect(fixture.nativeElement.querySelectorAll('.card-list__item').length).toBe(10);
    expect(fixture.nativeElement.querySelector('.card-list__total').textContent.trim()).toBe('23');
    const pagers: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('nav');
    expect(pagers.length).toBe(2);
    const card: HTMLElement = fixture.nativeElement.querySelector('.card-list');
    expect(pagers[0].parentElement).toBe(card);
    expect(pagers[1].parentElement).toBe(card);
    expect(pagers[0].previousElementSibling?.classList.contains('card-list__search')).toBe(true);
    expect(pagers[1].previousElementSibling?.classList.contains('card-list__content')).toBe(true);
    expect(card.querySelectorAll('.card-list__item nav').length).toBe(0);
    const secondPage = Array.from(pagers[0].querySelectorAll('button')).find(button => button.textContent?.trim() === '2')!;
    secondPage.click();
    fixture.detectChanges();
    expect(component.currentPage).toBe(2);
    expect(component.pagedItems[0].id).toBe('record-11');
    expect(Array.from(pagers).every(pager => pager.querySelector('[aria-current="page"]')?.textContent?.trim() === '2')).toBe(true);
    const lastPage = Array.from(pagers[1].querySelectorAll('button')).find(button => button.textContent?.trim() === '3')!;
    lastPage.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.card-list__item').length).toBe(3);
    expect(component.firstRecord).toBe(21);
    expect(component.lastRecord).toBe(23);
    expect(Array.from(pagers).every(pager => pager.querySelector('button:last-child')?.hasAttribute('disabled'))).toBe(true);
    expect(fixture.nativeElement.querySelector('.card-list__total').textContent.trim()).toBe('23');
  });

  it('resets local searches to page one without replacing the registered total', () => {
    setRecords(23);
    component.goToPage(3);
    component.onSearchChange('User 2');
    fixture.detectChanges();
    expect(component.currentPage).toBe(1);
    expect(component.filteredItems.length).toBe(5);
    expect(component.totalRecords).toBe(23);
    expect(component.pagedItems.length).toBe(5);
  });

  it('paginates remote search results and retains the full-load total', () => {
    fixture.componentRef.setInput('remoteSearch', true);
    setRecords(43);
    component.goToPage(5);
    component.onSearchChange('remote query');
    setRecords(12);
    expect(component.totalRecords).toBe(43);
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(2);
    component.goToPage(2);
    expect(component.pagedItems.length).toBe(2);
    component.onSearchChange('');
    setRecords(42);
    expect(component.totalRecords).toBe(42);
  });

  it('clamps the page after deleting the only record on the last page', () => {
    setRecords(21);
    component.goToPage(3);
    setRecords(20);
    expect(component.currentPage).toBe(2);
    expect(component.pagedItems.length).toBe(10);
    expect(component.totalRecords).toBe(20);
  });

  it('handles empty and null lists and rejects out-of-range page navigation', () => {
    setRecords(0);
    component.goToPage(2);
    component.goToPage(0);
    component.goToPage(1.5);
    expect(component.currentPage).toBe(1);
    expect(component.firstRecord).toBe(0);
    expect(component.lastRecord).toBe(0);
    expect(component.totalPages).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('nav button:disabled').length).toBe(4);
    fixture.componentRef.setInput('data', null);
    fixture.detectChanges();
    expect(component.pagedItems).toEqual([]);
  });

  it('keeps page controls bounded for large lists and preserves record action payloads', () => {
    setRecords(10000);
    component.goToPage(500);
    fixture.detectChanges();
    expect(component.pageNumbers).toEqual([1, 499, 500, 501, 1000]);
    expect(fixture.nativeElement.querySelector('nav').querySelectorAll('button').length).toBe(7);
    const edit = vi.fn();
    component.editItem.subscribe(edit);
    fixture.nativeElement.querySelector('.card-list__item button[title="Editar"]').click();
    expect(edit).toHaveBeenCalledWith(component.pagedItems[0]);
  });

  it('paginates every management list type consistently', () => {
    for (const type of ['student', 'guardian', 'driver', 'family', 'admins', 'schools', 'bus', 'stop', 'route']) {
      fixture.componentRef.setInput('type', type);
      setRecords(11);
      expect(component.pagedItems.length).toBe(10);
      expect(fixture.nativeElement.querySelectorAll('nav').length).toBe(2);
    }
  });
});
