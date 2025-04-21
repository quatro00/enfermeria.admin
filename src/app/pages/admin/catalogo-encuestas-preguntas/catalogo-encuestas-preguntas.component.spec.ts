import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoEncuestasPreguntasComponent } from './catalogo-encuestas-preguntas.component';

describe('CatalogoEncuestasPreguntasComponent', () => {
  let component: CatalogoEncuestasPreguntasComponent;
  let fixture: ComponentFixture<CatalogoEncuestasPreguntasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogoEncuestasPreguntasComponent]
    });
    fixture = TestBed.createComponent(CatalogoEncuestasPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
