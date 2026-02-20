import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminpageService } from '../adminpage.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Import FormBuilder, FormGroup, Validators
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { MemberprofileComponent } from '../memberprofile/memberprofile.component';
import { LoginComponent } from '../login/login.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-ott-movie',
  standalone: true,
  imports: [FormsModule,CommonModule,NzUploadModule,ReactiveFormsModule],
  templateUrl: './add-ott-movie.component.html',
  styleUrl: './add-ott-movie.component.css'
})
export class AddOttMovieComponent {
  movieForm: FormGroup;
  minDate: string = '';
  maxDate: string = '';
  bannerFileList: NzUploadFile[] = [];
  userId:any;
  selectedDate: Date | null = null;
  formDisabled = false;
  categories: any;
  videoFileList: NzUploadFile[] = [];   
  platforms:any;
  generes:any;
  languages:any;




  ngOnInit() {
    this.fetchheaderCategories();
    this.fetchplatforms();
    this.fetchgeneres();
    this.fetchlanguages();
    this.userId = localStorage.getItem('user_id') || ''; 
      console.log("Loaded User ID:", this.userId);

  }

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private adminservice: AdminpageService ,private router: Router,public authservice:AuthService
  ) {
    this.movieForm = this.fb.group({
      title: ['',Validators.required],
      release_date: ['',Validators.required],
      status: 'SUCCESS',
      cast: ['',Validators.required],
      geners_id: [''],
      platform_id: [''],
      header_id: ['',Validators.required],
      poster: ['',Validators.required],
      // trailer:[''], 
      trailer_link:[''],
      language:[''],
      publish_at: [new Date().toISOString().substring(0, 16)],
      user_id:localStorage.getItem('user_id'),

    });
  }

    onSubmit(): void {
    if (this.movieForm.valid) {
      const formValue = { ...this.movieForm.value,user:this.userId }; 
  
      console.log(formValue, 'Submitted Data');
      const token = this.authservice.getToken();
      console.log("Token:", token);
      
      if (token) {
        this.formDisabled = true;
        this.adminservice.Moviecontent(formValue, token).subscribe(
          response => {
            console.log('News added successfully', response);
            this.movieForm.reset();
            this.bannerFileList = []; 
            this.videoFileList=[];
            this.formDisabled = false;

          },
          error => {
            console.error('Error adding news:', error);
  
            // Check for "User is not a member" error
            if (error.error && error.error.error === 'User is not a member') {
              this.openAnotherFormDialog();
            } else {
              // Log other errors
              console.log('Other error:', error);
            }
            this.formDisabled = false;
          }
        );
      } else {
        console.error('No access token found. Please log in.');
      }
    } else {
      this.movieForm.markAllAsTouched(); 
    }
  }

// onSubmit(): void {
//   if (this.movieForm.valid) {
//     const formValue = { ...this.movieForm.value };

//     this.formDisabled = true;

//     this.adminservice.Moviecontent(formValue).subscribe(
//       (response) => {
//         console.log('Content added successfully', response);

//         this.movieForm.reset();
//         this.bannerFileList = [];
//         this.videoFileList = [];
//         this.formDisabled = false;
//       },
//       (error) => {
//         console.error('Error adding content:', error);

//         if (error?.error?.message === "User is not a member") {
//           console.error("User is not a member");
//         } else {
//           console.error("Other error:", error);
//         }

//         this.formDisabled = false;
//       }
//     );

//   } else {
//     this.movieForm.markAllAsTouched();
//   }
// }






  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.userId = localStorage.getItem('user_id') || '';
        // this.openAnotherFormDialog();
      } 
    });
  }


  openAnotherFormDialog(): void {
    this.dialog.open(MemberprofileComponent, {
      data: { userId: this.userId }
    });
  }


handleBannerFileRemove(): void {
  // Handle file remove event if needed
  if (this.bannerFileList.length === 0) {
    // No files remaining, trigger validation message
    this.bannerFileList = [];
  }
}


fileList: NzUploadFile[] = [];


handleBannerFileChange(info: NzUploadChangeParam): void {
  this.handleUpload(info, 'poster');
}

handleVideoFileChange(info: NzUploadChangeParam): void {
  this.handleUpload(info, 'trailer');
}


handleUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  fileList.forEach((file: NzUploadFile) => {
    if (formControlName === 'poster') {
      // If uploading an image, convert to base64
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        this.movieForm.patchValue({ poster: base64String });
      });
    } else if (formControlName === 'trailer') {
      // Convert the video to base64
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        this.movieForm.patchValue({ trailer: base64String });  // Save base64 string for the video
      });
    }
  });

  // Update file list for the respective form control
  this.movieForm.get(formControlName)?.setValue(fileList);

  // Set fileList variables based on the type of upload
  if (formControlName === 'poster') {
    this.bannerFileList = fileList;
  } else if (formControlName === 'trailer') {
    this.videoFileList = fileList;
  }
  console.log(`${formControlName} submit`, this.movieForm.value);
}

// handleUpload(info: NzUploadChangeParam, formControlName: string): void {
//   const fileList = [...info.fileList];
//   const base64List: string[] = []; 

//   fileList.forEach((file: NzUploadFile) => {
//     this.getBase64(file.originFileObj!, (base64String: string) => {
//       base64List.push(base64String); 
//       this.movieForm.patchValue({ image_location: base64List });
//     });
//   });

//   this.movieForm.get(formControlName)?.setValue(fileList);
//   if (formControlName === 'images') {
//     this.bannerFileList = fileList;
//   } else if (formControlName === 'bannerImage') {
//     this.bannerFileList = fileList;
//   }
// }

getBase64(file: File, callback: (base64String: string) => void): void {
  const reader = new FileReader();
  reader.onload = () => {
    let base64String = reader.result as string;
    base64String = base64String.split(',')[1];
    callback(base64String);
  };
  reader.readAsDataURL(file);
}






handleVideoFileRemove(): void {
  this.videoFileList = [];
  this.movieForm.patchValue({ trailer: null });  // Remove video from the form
}


fetchheaderCategories(): void {
  this.adminservice.movieheaders().subscribe(
    data => {
      this.categories = data;
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
}

fetchplatforms(): void {
  this.adminservice.movieplatforms().subscribe(
    data => {
      this.platforms = data.result;
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
}

fetchgeneres(): void {
  this.adminservice.moviegeners().subscribe(
    data => {
      this.generes = data.result;
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
}


    fetchlanguages() {
    this.adminservice.Fetchlanguages().subscribe(
      (response) => {
        this.languages = response;
      },
      (error) => {
        console.error("Error loading geners", error);
      }
    );
  }














}
