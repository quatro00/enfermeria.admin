import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoEncuestasComponent } from './catalogo-encuestas.component';

describe('CatalogoEncuestasComponent', () => {
  let component: CatalogoEncuestasComponent;
  let fixture: ComponentFixture<CatalogoEncuestasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogoEncuestasComponent]
    });
    fixture = TestBed.createComponent(CatalogoEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
