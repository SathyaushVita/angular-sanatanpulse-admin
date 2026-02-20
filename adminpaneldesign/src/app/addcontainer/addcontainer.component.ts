import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
// import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Import FormBuilder, FormGroup, Validators
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { AdminpageService } from '../adminpage.service';
import { ReactiveFormsModule } from '@angular/forms';
// import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { MemberprofileComponent } from '../memberprofile/memberprofile.component';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-addcontainer',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NzUploadModule],
  templateUrl: './addcontainer.component.html',
  styleUrl: './addcontainer.component.css'
})
export class AddcontainerComponent {
  newsForm: FormGroup;
  minDate: string = '';
  maxDate: string = '';
  bannerFileList: NzUploadFile[] = [];
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private adminservice: AdminpageService ,private router: Router,public authservice:AuthService// Inject your service here
  ) {
    this.newsForm = this.fb.group({
      headline: ['',Validators.required],
      desc: ['',Validators.required],
      short_description: ['',Validators.required],
      status: 'PENDING',
      location: ['',Validators.required],
      category_id: ['',Validators.required],
      news_sub_category_id: [''],
      image_location: ['',Validators.required],
      audio_location: ['',Validators.required],
      media:[''], 
      other_category_id: [''],
      
      language: ['88aff31a-23c4-11ef-85c8-00e04ca50182'],
      // published_at: [''],
      publish_at: [new Date().toISOString().substring(0, 16)],
      is_published:['',Validators.required]
      // language:['', Validators.required]
      // user: [null]
    });
  }
  userId:any;
  selectedDate: Date | null = null;
  ngOnInit() {
    this.fetchCategories();
    this.userId = localStorage.getItem('user_id') || ''; 
    // this.getAllLanguages();
  }
  

  

    
  formDisabled = false;

// Helper method to transform media into a list


private transformMedia(media: string): string[] {
  return media ? media.split(',').map(item => item.trim()) : [];
}

// onDateChange() {
// }


  onSubmit(): void {
    if (this.newsForm.valid) {
      const formValue = { ...this.newsForm.value,user:this.userId, media: this.transformMedia(this.newsForm.value.media) }; 
  
      console.log(formValue, 'Submitted Data');
      const token = this.authservice.getToken();
      console.log("Token:", token);
      
      if (token) {
        this.formDisabled = true;
        this.adminservice.addContainerData(formValue, token).subscribe(
          response => {
            console.log('News added successfully', response);
            this.newsForm.reset();
            this.bannerFileList = []; 
            this.audioFileList=[];
            this.formDisabled = false;
              // Display success message
          // alert('News submitted successfully!');
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
      this.newsForm.markAllAsTouched(); 
    }
  }
  
  
  
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

categories: any;
subCategories: any;
selectedCategoryId: string | null = null;
filteredSubCategories: any[] = [];
  
fetchCategories(): void {
  this.adminservice.getCategories().subscribe(
    data => {
      this.categories = data;
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
}

fetchSubCategories(): void {
  this.adminservice.getSubCategories().subscribe(
    (data: any) => {  
      this.subCategories = data.results; 
    },
    error => {
      console.error('Error fetching subcategories:', error);
    }
  );
}

getCategoryName(id: string): string {
  const category = this.categories.find((cat: any) => cat._id === id);
  return category ? category.name : 'No category';
}

getSubCategoryName(id: string): string {
  const subCategory = this.subCategories.find((subCat: any) => subCat._id === id);
  return subCategory ? subCategory.name : 'No subcategory';
}

onCategoryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.selectedCategoryId = target.value;
  this.fetchSubCategoriesByCategoryId(this.selectedCategoryId);
}


fetchSubCategoriesByCategoryId(categoryId: string): void {
  this.adminservice.getSubcategoriesbyId(categoryId).subscribe(
    (data: any) => {
      this.filteredSubCategories = data.results;
    },
    error => {
      console.error('Error fetching subcategories by category ID:', error);
    }
  );
}


audioFileList: NzUploadFile[] = []; 
handleAudioFileChange(event: NzUploadChangeParam): void {
  const fileStatus = event.file.status;

  if (fileStatus === 'done' || fileStatus === 'uploading') {
    const file = event.file.originFileObj as File;

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Audio = reader.result as string;

        // Only get the base64 string part after the comma
        const base64String = base64Audio.split(',')[1];

        // Set the value using the FormGroup method
        this.newsForm.get('audio_location')?.setValue(base64String); // Use `get` method to access the control
      };

      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
      };

      reader.readAsDataURL(file);
    }
  } 
  else if (fileStatus === 'error') {
    console.error('Audio upload failed:', event.file.response);
  }
}


onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    console.log('Selected file:', file);

  }
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
  this.handleUpload(info, 'bannerImage');
}



handleUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];
  const base64List: string[] = []; 

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      base64List.push(base64String); 
      this.newsForm.patchValue({ image_location: base64List });
    });
  });

  this.newsForm.get(formControlName)?.setValue(fileList);
  if (formControlName === 'images') {
    this.bannerFileList = fileList;
  } else if (formControlName === 'bannerImage') {
    this.bannerFileList = fileList;
  }
}

getBase64(file: File, callback: (base64String: string) => void): void {
  const reader = new FileReader();
  reader.onload = () => {
    let base64String = reader.result as string;
    base64String = base64String.split(',')[1];
    callback(base64String);
  };
  reader.readAsDataURL(file);
}

// LanguageOptions:any[]=[];
// getAllLanguages(): void {
//     console.log("fetch");
//     this.adminservice.Getalllanguages().subscribe(
//       (res) => {
//         if (Array.isArray(res)) {
//           res.forEach((language: any) => {
//             this.LanguageOptions.push({
//               label: language.name,
//               value: language._id
//             });
//           }); 
//           console.log(this.LanguageOptions, "Language Options");
//         } else {
//           console.error("Invalid response format: not an array");
//         }
//       },
//       (err) => {
//         console.error("Error fetching languages:", err);
//       }
//     );
//   }


}
