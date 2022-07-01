import { Component } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'ragu-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent{
  items: MenuItem[];

  constructor() { 
    this.items = [
      {
        label: 'Locais de entrega',
        icon: PrimeIcons.MAP,
        routerLink: ['/delivery-locales']
      },
      {
        label: 'Produtos',
        icon: PrimeIcons.STAR,
        routerLink: ['/products']
      },
      {
        label: 'Clientes',
        icon: PrimeIcons.USER,
        routerLink: ['/customers']
      }
    ];
  }
}
