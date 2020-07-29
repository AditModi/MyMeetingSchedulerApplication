import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavtogglerComponent } from './sidenavtoggler.component';

describe('SidenavtogglerComponent', () => {
  let component: SidenavtogglerComponent;
  let fixture: ComponentFixture<SidenavtogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavtogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavtogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
