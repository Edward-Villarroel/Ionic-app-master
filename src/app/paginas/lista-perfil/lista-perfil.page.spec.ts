import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPerfilPage } from './lista-perfil.page';

describe('ListaPerfilPage', () => {
  let component: ListaPerfilPage;
  let fixture: ComponentFixture<ListaPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
