import { Component, OnInit } from "@angular/core";
import { AppService } from "../../app.service";

@Component({
  selector: "app-sidenavtoggler",
  templateUrl: "./sidenavtoggler.component.html",
  styleUrls: ["./sidenavtoggler.component.css"]
})
export class SidenavtogglerComponent implements OnInit {
  constructor(public appService: AppService) {}

  ngOnInit() {}
}
