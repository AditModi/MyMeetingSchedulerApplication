import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMeetingComponent } from './create-meeting.component';

describe('CreateMeetingComponent', () => {
  let component: CreateMeetingComponent;
  let fixture: ComponentFixture<CreateMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
