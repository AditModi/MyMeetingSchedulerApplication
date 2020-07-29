import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "../home/login/login.component";
import { SignupComponent } from "../home/signup/signup.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SharedModule } from "../shared/shared.module";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NavbarComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: "signup", component: SignupComponent },
      { path: "forgotPassword", component: ForgotPasswordComponent },
      { path: "resetPassword/:id/:token", component: ResetPasswordComponent }
    ]),
    SharedModule
  ]
})
export class HomeModule {}
