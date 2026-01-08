import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsPage } from './movements';

describe('MovementsPage', () => {
  let component: MovementsPage;
  let fixture: ComponentFixture<MovementsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MovementsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
