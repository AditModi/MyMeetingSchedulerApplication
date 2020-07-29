import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TopnavComponent } from "./topnav/topnav.component";
import { SidenavtogglerComponent } from "./sidenavtoggler/sidenavtoggler.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [TopnavComponent, SidenavtogglerComponent, SidenavComponent],
  imports: [RouterModule, CommonModule],
  exports: [TopnavComponent, SidenavtogglerComponent, SidenavComponent]
})
export class SharedModule {}
