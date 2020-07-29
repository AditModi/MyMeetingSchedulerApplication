import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  SimpleChange
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
//toaster
import { ToastrService } from "ngx-toastr";
//import service
import { AppService } from "../../app.service";

import names from "../../../assets/names.json";
import phones from "../../../assets/phones.json";
import { ImageUploadService } from "src/app/image-upload.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  public countryName = [];
  public phoneCode = [];

  public firstName: string = "";
  public lastName: string = "";
  public email: string = "";
  public password: string = "";
  public confirmPassword: string = "";
  public selectedCountryCode: string = "IN";
  public selectedCountryName: string = "";
  public internationalCode: string = "91";
  public mobileNumber: number;
  public userName: string = "";
  public userRole: string = "normal";
  url: string | ArrayBuffer;

  imageObj: File;
  imageUrl: string;


  constructor(
    public appService: AppService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit() {
    this.getCountryName();
    this.getPhoneCode();
    this.selectCountry(this.selectedCountryCode);
    // console.log(this.userRole);
  }

  public getCountryName: any = () => {
    let result = Object.keys(names).map(data => {
      return { code: data, name: names[data] };
    });
    return (this.countryName = result);
  };

  public getPhoneCode: any = () => {
    let result = Object.keys(phones).map(data => {
      return { code: data, number: phones[data] };
    });
    return (this.phoneCode = result);
  };
  public changed = event => {
    this.selectCountry(this.selectedCountryCode);
    for (let each of this.getPhoneCode()) {
      if (event.target.value === each.code) {
        this.internationalCode = each.number;
      }
    }
  };
  public selectRole = event => {
    console.log(this.userRole);
    this.userRole == "admin"
      ? (this.userName = `${this.userName}-${this.userRole}`)
      : (this.userName = this.userName.substring(
          0,
          this.userName.indexOf("-")
        ));
    console.log(this.userName);
  };

  public selectCountry = name => {
    Object.keys(names).map(data => {
      if (data == name) {
        this.selectedCountryName = names[data];
      }
    });
  };

  public goToSignIn: any = () => {
    this.router.navigate(["/"]);
  }; //end of goToSignIn

  onSelectFile(event) {
    document.querySelector(".custom-file-label").textContent =
      event.target.files[0].name;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      console.log("event.target.files[0]", event.target.files[0]);
      this.imageObj = event.target.files[0];
      reader.onload = event => {
        // called once readAsDataURL is completed
        console.log("onload", event.target["result"]);
        this.url = event.target["result"];
      };
    }
  }

  onImageUpload() {
    this.appService.showLoadingSpinner();
    if (this.url != undefined) {
      document.getElementById("imagePreview").style.display = "none";
    }
    const imageForm = new FormData();
    imageForm.append("image", this.imageObj);
    this.imageUploadService.imageUpload(imageForm).subscribe(res => {
      this.appService.hideLoadingSpinner();
      this.imageUrl = res["image"];
      this.imageUrl = `https://project-images-upload.s3.amazonaws.com/${this.imageUrl}`;
      console.log(this.imageUrl);
    });
  }

  public signUpFunction: any = () => {
    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      mobileNumber: this.mobileNumber,
      email: this.email,
      password: this.password,
      userRole: this.userRole,
      userName: this.userName,
      countryCode: this.selectedCountryCode,
      countryName: this.selectedCountryName,
      internationalCode: this.internationalCode,
      avatar: this.imageUrl
    };
    // console.log("data", data);
    document.querySelector(".signUpBtn").textContent = "Signing....";
    this.appService.signUpFunction(data).subscribe(
      apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status == 200) {
          this.toastr.success("Signup successful");
          setTimeout(() => {
            this.goToSignIn();
          }, 200);
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        console.log(err);
        document.querySelector(".signUpBtn").textContent = "Sign Up";
        this.toastr.error(err.error.message);
      }
    );
  };

  public cancelRegister: any = () => {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";

    this.selectedCountryName = "";
    this.userName = "";
  };
}
