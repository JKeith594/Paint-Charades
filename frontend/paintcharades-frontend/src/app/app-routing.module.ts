import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { LobbyPageComponent } from './pages/lobby-page/lobby-page.component';
import { LogOnPageComponent } from './pages/log-on-page/log-on-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/logon', pathMatch: 'full'},
  { path: 'lobby', component: LobbyPageComponent},
  { path: 'logon', component: LogOnPageComponent},
  { path: 'game', component: GamePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
