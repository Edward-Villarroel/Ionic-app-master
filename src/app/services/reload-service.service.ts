import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReloadServiceService {

  constructor(private router:Router) { }
  reloadRoute(): void {
    this.router.navigate([this.router.url]);
  }
  reloadPage(): void {
    window.location.reload();
  }
}
