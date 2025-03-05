import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoRegistroComponent } from './pago-registro.component';

describe('PagoRegistroComponent', () => {
  let component: PagoRegistroComponent;
  let fixture: ComponentFixture<PagoRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagoRegistroComponent]
    });
    fixture = TestBed.createComponent(PagoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
