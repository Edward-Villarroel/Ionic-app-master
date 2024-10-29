import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarUsuarioPage } from './cambiar-usuario.page';

describe('CambiarUsuarioPage', () => {
  let component: CambiarUsuarioPage;
  let fixture: ComponentFixture<CambiarUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
