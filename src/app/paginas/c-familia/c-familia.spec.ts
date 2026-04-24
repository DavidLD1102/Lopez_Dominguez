import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CFamilia } from './c-familia';

describe('CFamilia', () => {
  let component: CFamilia;
  let fixture: ComponentFixture<CFamilia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CFamilia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CFamilia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
