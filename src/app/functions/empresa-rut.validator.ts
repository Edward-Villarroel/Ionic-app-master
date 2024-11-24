import { AbstractControl, ValidationErrors } from '@angular/forms';

export function empresaRUTValidator(control: AbstractControl): ValidationErrors | null {
  const rut = control.value;

  if (!rut) {
    return null;
  }

  const isEmpresa = isEmpresaRUT(rut);

  return isEmpresa ? null : { invalidRUT: true };
}

function isEmpresaRUT(rut: string): boolean {
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  const rutNumber = parseInt(cleanRut.slice(0, -1), 10);
  const dv = cleanRut.slice(-1).toUpperCase();

  if (isNaN(rutNumber) || rutNumber < 50000000) {
    return false;
  }

  return validateDV(rutNumber, dv);
}

function validateDV(rutNumber: number, dv: string): boolean {
  let sum = 0;
  let multiplier = 2;

  while (rutNumber > 0) {
    sum += (rutNumber % 10) * multiplier;
    rutNumber = Math.floor(rutNumber / 10);
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const calculatedDV = 11 - (sum % 11);
  const dvExpected = calculatedDV === 11 ? '0' : calculatedDV === 10 ? 'K' : calculatedDV.toString();

  return dv === dvExpected;
}
