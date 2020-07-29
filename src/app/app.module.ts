import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
//importing formsModule
import { FormsModule } from "@angular/forms";
//importing HttpClientModule
import { HttpClientModule } from "@angular/common/http";


//importing toaster
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastContainerModule } from "ngx-toastr";
import { NgxSpinnerModule } from "ngx-spinner";
//importing modules
import { UserModule } from "./user/user.module";
//importing service
import { AppService } from "./app.service";
import { HomeModule } from "./home/home.module";
import { AdminModule } from "./admin/admin.module";
import { SharedModule } from "./shared/shared.module";
import { SocketService } from "./socket.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    HttpClientModule,
    FormsModule,
    UserModule,
    HomeModule,
    AdminModule
  ],
  providers: [AppService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
