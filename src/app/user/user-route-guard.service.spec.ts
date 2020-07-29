import { TestBed } from '@angular/core/testing';

import { UserRouteGuardService } from './user-route-guard.service';

describe('UserRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserRouteGuardService = TestBed.get(UserRouteGuardService);
    expect(service).toBeTruthy();
  });
});
