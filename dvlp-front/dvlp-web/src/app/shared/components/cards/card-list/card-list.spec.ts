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
