import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManiobrasDiarioComponent } from './maniobras-diario.component';

describe('ManiobrasDiarioComponent', () => {
  let component: ManiobrasDiarioComponent;
  let fixture: ComponentFixture<ManiobrasDiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManiobrasDiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManiobrasDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
