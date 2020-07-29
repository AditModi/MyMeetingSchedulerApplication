import { TestBed } from '@angular/core/testing';

import { AdminRouteGuardService } from './admin-route-guard.service';

describe('AdminRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminRouteGuardService = TestBed.get(AdminRouteGuardService);
    expect(service).toBeTruthy();
  });
});
