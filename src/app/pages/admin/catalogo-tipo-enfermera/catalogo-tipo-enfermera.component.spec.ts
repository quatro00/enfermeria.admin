import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoTipoEnfermeraComponent } from './catalogo-tipo-enfermera.component';

describe('CatalogoTipoEnfermeraComponent', () => {
  let component: CatalogoTipoEnfermeraComponent;
  let fixture: ComponentFixture<CatalogoTipoEnfermeraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogoTipoEnfermeraComponent]
    });
    fixture = TestBed.createComponent(CatalogoTipoEnfermeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
