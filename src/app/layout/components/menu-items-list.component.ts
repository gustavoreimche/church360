import { Component, input } from '@angular/core';
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { RouterLink } from '@angular/router';

export interface IMenuItem {
  label: string;
  icon?: string;
  routerLink?: string;
  subMenus?: IMenuItem[];
}

@Component({
  selector: 'app-menu-items-list',
  imports: [NzMenuItemComponent, RouterLink, NzMenuDirective, NzSubMenuComponent],
  template: `
    <ul nz-menu nzTheme="dark" nzMode="inline" [nzInlineCollapsed]="isCollapsed()">
      @for (menu of menuItems(); track menu) {
        @if (menu.subMenus?.length) {
          <li nz-submenu nzOpen [nzTitle]="menu.label" [nzIcon]="menu.icon || ''">
            <ul>
              <app-menu-items-list
                [menuItems]="menu.subMenus || []"
                [isCollapsed]="isCollapsed()"
              ></app-menu-items-list>
            </ul>
          </li>
        } @else {
          <li nz-menu-item nzMatchRouter>
            <a [routerLink]="menu.routerLink">{{ menu.label }}</a>
          </li>
        }
      }
    </ul>
  `,
})
export class MenuItemsListComponent {
  menuItems = input.required<IMenuItem[]>();
  isCollapsed = input.required<boolean>();
}
