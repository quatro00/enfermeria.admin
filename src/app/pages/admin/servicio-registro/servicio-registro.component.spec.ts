import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioRegistroComponent } from './servicio-registro.component';

describe('ServicioRegistroComponent', () => {
  let component: ServicioRegistroComponent;
  let fixture: ComponentFixture<ServicioRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicioRegistroComponent]
    });
    fixture = TestBed.createComponent(ServicioRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
