import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeModule } from "./home/home.module";
import { LoginComponent } from "./home/login/login.component";
import { PageNotFoundComponent } from "./home/page-not-found/page-not-found.component";
import { UserModule } from "./user/user.module";
import { AdminModule } from "./admin/admin.module";


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full"
    // data: { animation: "isLogin" }
  },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "*", component: LoginComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeModule, UserModule, AdminModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
