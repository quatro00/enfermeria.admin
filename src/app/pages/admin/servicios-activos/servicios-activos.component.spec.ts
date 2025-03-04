import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosActivosComponent } from './servicios-activos.component';

describe('ServiciosActivosComponent', () => {
  let component: ServiciosActivosComponent;
  let fixture: ComponentFixture<ServiciosActivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiciosActivosComponent]
    });
    fixture = TestBed.createComponent(ServiciosActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
