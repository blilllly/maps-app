import { Component, inject, Type } from '@angular/core';
import { routes } from '../../../app.routes';
import {
  NavigationEnd,
  Resolve,
  ResolveFn,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  router = inject(Router);

  routes = routes
    .map((route) => ({
      path: route.path,
      title: `${route.title ?? 'Maps en Angular'}`,
    }))
    .filter((route) => route.path !== '**');

  // Observable
  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    // tap((event) => console.log(event)),
    map((event) => event.url),
    map(
      (url) =>
        routes.find((route) => `/${route.path}` === url)?.title ?? 'Mapas'
    )
  );

  // Signal
  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // tap((event) => console.log(event)),
      map((event) => event.url),
      map(
        (url) =>
          routes.find((route) => `/${route.path}` === url)?.title ?? 'Mapas'
      )
    )
  );
}
