import { TestBed } from '@angular/core/testing';

import { Familia } from './familia';

describe('Familia', () => {
  let service: Familia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Familia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
