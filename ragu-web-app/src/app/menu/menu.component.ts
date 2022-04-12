import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'ragu-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  items: MenuItem[];

  constructor() { 
    this.items = [{
      label: 'Locais de entrega',
      icon: PrimeIcons.MAP,
      routerLink: ['/delivery-locales']
    }];
  }
  
  ngOnInit(): void {
    
  }
}
