import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcontainersComponent } from './addcontainers.component';

describe('AddcontainersComponent', () => {
  let component: AddcontainersComponent;
  let fixture: ComponentFixture<AddcontainersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcontainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcontainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
