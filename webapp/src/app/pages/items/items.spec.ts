import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPage } from './items';

describe('ItemsPage', () => {
  let component: ItemsPage;
  let fixture: ComponentFixture<ItemsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
