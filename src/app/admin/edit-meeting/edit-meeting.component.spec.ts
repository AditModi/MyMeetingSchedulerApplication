import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeetingComponent } from './edit-meeting.component';

describe('EditMeetingComponent', () => {
  let component: EditMeetingComponent;
  let fixture: ComponentFixture<EditMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
