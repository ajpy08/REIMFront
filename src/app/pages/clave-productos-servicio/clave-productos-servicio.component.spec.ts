import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaveProductosServicioComponent } from './clave-productos-servicio.component';

describe('ClaveProductosServicioComponent', () => {
  let component: ClaveProductosServicioComponent;
  let fixture: ComponentFixture<ClaveProductosServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaveProductosServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaveProductosServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
