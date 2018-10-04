import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NotesComponent } from './components/notes/notes.component';
import { RemindersComponent } from './components/reminders/reminders.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { TrashComponent } from './components/trash/trash.component';
import { LabelComponent } from './components/label/label.component';
import { SearchComponent } from './components/search/search.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'forgot', component: ForgotPasswordComponent},
  { path: 'reset/:token', component: ResetPasswordComponent},
  { path: 'home', component: HomeComponent, children: [
    { path: 'notes', component: NotesComponent, canActivate:[AuthGuard]},
    { path: 'reminders', component: RemindersComponent, canActivate:[AuthGuard]},
    { path: 'archive', component: ArchiveComponent, canActivate:[AuthGuard]},
    { path: 'trash', component: TrashComponent, canActivate:[AuthGuard]},
    { path: 'label/:labelName', component: LabelComponent, canActivate:[AuthGuard]},
    { path: 'search', component: SearchComponent, canActivate:[AuthGuard]}
  ]},
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
