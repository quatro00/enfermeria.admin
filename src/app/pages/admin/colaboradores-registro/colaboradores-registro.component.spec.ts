import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboradoresRegistroComponent } from './colaboradores-registro.component';

describe('ColaboradoresRegistroComponent', () => {
  let component: ColaboradoresRegistroComponent;
  let fixture: ComponentFixture<ColaboradoresRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColaboradoresRegistroComponent]
    });
    fixture = TestBed.createComponent(ColaboradoresRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
