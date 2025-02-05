import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../components/loading.component';
import { NzContentComponent, NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout';
import { appMenus } from '../app.routes';
import { MenuItemsListComponent } from './components/menu-items-list.component';

@Component({
  imports: [
    RouterOutlet,
    LoadingComponent,
    NzLayoutComponent,
    NzSiderComponent,
    NzContentComponent,
    MenuItemsListComponent,
  ],
  template: `
    <app-loading>
      <nz-layout class="app-layout">
        <nz-sider
          class="menu-sidebar"
          nzCollapsible
          nzWidth="256px"
          nzBreakpoint="md"
          [(nzCollapsed)]="isCollapsed"
          [nzTrigger]="null"
        >
          <div class="sidebar-logo">
            <a href="https://ng.ant.design/" target="_blank">
              <img src="https://ng.ant.design/assets/img/logo.svg" alt="logo" />
              <h1>Ant Design of Angular</h1>
            </a>
          </div>
          <app-menu-items-list [menuItems]="menus" [isCollapsed]="isCollapsed" />
        </nz-sider>
        <nz-layout>
          <nz-content>
            <div class="inner-content">
              <router-outlet></router-outlet>
            </div>
          </nz-content>
        </nz-layout>
      </nz-layout>
    </app-loading>
  `,
  styles: `
    :host {
      display: flex;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .app-layout {
      height: 100vh;
    }

    .menu-sidebar {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    }

    .header-trigger {
      height: 52px;
      padding: 20px 18px;
      font-size: 20px;
      cursor: pointer;
      transition:
        all 0.3s,
        padding 0s;
    }

    .trigger:hover {
      color: #1890ff;
    }

    .sidebar-logo {
      position: relative;
      height: 64px;
      padding-left: 24px;
      overflow: hidden;
      line-height: 64px;
      background: #001529;
      transition: all 0.3s;
    }

    .sidebar-logo img {
      display: inline-block;
      height: 32px;
      width: 32px;
      vertical-align: middle;
    }

    .sidebar-logo h1 {
      display: inline-block;
      margin: 0 0 0 20px;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      vertical-align: middle;
    }

    nz-header {
      padding: 0;
      width: 100%;
      z-index: 2;
    }

    .app-header {
      position: relative;
      height: 52px;
      padding: 0;
      background: #fff;
      width: 100%;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }

    .inner-content {
      padding: 8px;
      background: #fff;
      height: 100%;
      width: calc(100dvw - 256px);
    }

    @media screen and (max-width: 768px) {
      .inner-content {
        padding: 8px;
        height: 100%;
        width: calc(100dvw - 64px);
      }
    }
  `,
})
export class MainLayout {
  isCollapsed = window.innerWidth <= 768;
  menus = appMenus;
}
