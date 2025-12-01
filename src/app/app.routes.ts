import { Routes } from '@angular/router';
import { authGuard, NoAuthGuard } from '@core/auth/auth.guard';

export const routes: Routes = [
  // RUTAS PÚBLICAS
  {
    path: 'auth',
    canActivate: [NoAuthGuard], 
    loadComponent: () => import('@layout/auth-layout/auth-layout').then(m => m.AuthLayoutComponent),
    children: [
      { path: 'login', loadComponent: () => import('@features/auth/login/login').then(m => m.Login) },
      { path: 'register', loadComponent: () => import('@features/auth/register/register').then(m => m.Register) },
      { path: '', redirectTo: 'login', pathMatch: 'full' } 
    ]
  },

  // RUTAS PRIVADAS
  {
    path: '',
    loadComponent: () => import('@layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { 
        path: 'chat', 
        canActivate: [authGuard],
        loadComponent: () => import('@features/chat/chat-container/chat-container').then(m => m.ChatContainer),
        children: [
           // Cuando seleccionas un usuario de la lista
          { path: ':conversationId',
            canActivate: [authGuard],
            loadComponent: () => import('@features/chat/message-view/message-view').then(m => m.MessageView) 
          },
          {
            path: '',
            canActivate: [authGuard],
            loadComponent: () => import('@features/chat/components/empty-chat/empty-chat').then(m => m.EmptyChat)
          }
        ]
      },
      { path: '', redirectTo: 'chat', pathMatch: 'full' }
    ]
  },
    // Ruta comodín para redirigir a login
  { path: '**', redirectTo: 'auth' }
];