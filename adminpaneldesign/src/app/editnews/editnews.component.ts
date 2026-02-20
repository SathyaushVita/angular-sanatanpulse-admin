import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminpageService } from '../adminpage.service';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';




@Component({
  selector: 'app-editnews',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzUploadModule],
  templateUrl: './editnews.component.html',
  styleUrl: './editnews.component.css'
})
export class EditnewsComponent {
  bannerFileList: NzUploadFile[] = [];
  editForm!: FormGroup;
  newsId!: string;
  currentImage: string | undefined; 
  currentAudio: string | undefined; 

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminService: AdminpageService,
  ) {}

  ngOnInit(): void {
    
    this.newsId = this.route.snapshot.paramMap.get('id')!;
    this.editForm = this.fb.group({
      headline: ['',Validators.required],
      desc: ['',Validators.required],
      short_description: ['',Validators.required],
      status: ['PENDING'],
      location: ['',Validators.required],
      category_id: ['',Validators.required],
      news_sub_category_id: [''],
      image_location: ['',Validators.required],
      audio_location: ['',Validators.required],
      language: ['88aff31a-23c4-11ef-85c8-00e04ca50182'],
      media:[''],
      // language:['', Validators.required]
      publish_at: [new Date().toISOString().substring(0, 16)],
      is_published:['']
    
    });

    this.fetchNewsData();
    this.fetchCategories();
    this.fetchSubCategories();
    // this.getAllLanguages();
    
   
  }

 

  // onSubmit(): void {
  //   if (this.editForm.valid) {
  //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",this.editForm.value)
  //     this.adminService.EditNewsstaging(this.newsId, this.editForm.value).subscribe(
  //       response => {
  //         console.log('News updated successfully:', response);
  //         this.editForm.reset();
 
  //         this.profileImage = null;
  //         this.audioBase64 = null;
          
  //       },
  //       error => {
  //         console.error('Error updating news:', error);
  //       }
  //     );
  //   }
  // }




  onSubmit(): void {
    if (this.editForm.valid) {
      const formData = this.editForm.value;
  // Ensure 'media' is an array if it's a string
  if (typeof formData.media === 'string') {
    formData.media = formData.media.split(','); // Split the string into an array
  }

      console.log("Form Value Before Sending:", formData);
      this.adminService.EditNewsstaging(this.newsId, formData).subscribe(
        response => {
          console.log('News updated successfully:', response);
          this.editForm.reset();
          this.profileImage = null;
          this.audioBase64 = null;
        },
        error => {
          console.error('Error updating news:', error);
        }
      );
    }
  }
  

  handleBannerFileRemove(file: any): boolean {
    
    this.bannerFileList = this.bannerFileList.filter(f => f.uid !== file.uid);
    return true;
  }

  
  handleBannerFileChange(info: NzUploadChangeParam): void {
    this.handleUpload(info, 'bannerImage');
  }
  

  
  handleUpload(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];
    const base64List: string[] = []; 
  
    fileList.forEach((file: NzUploadFile) => {
      this.getBase64(file.originFileObj!, (base64String: string) => {
        base64List.push(base64String); 
        this.editForm.patchValue({ image_location: base64List });
        console.log('ssssssssssssssssssssssssssssssssssss', this.editForm)
      });
    });
  
    this.editForm.get(formControlName)?.setValue(fileList);
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

 


categories: any;
subCategories: any;

getCategoryName(id: string): string {
  const category = this.categories.find((cat: any) => cat._id === id);
  return category ? category.name : 'No category';
}

getSubCategoryName(id: string): string {
  const subCategory = this.subCategories.find((subCat: any) => subCat._id === id);
  return subCategory ? subCategory.name : 'No subcategory';
}


fetchCategories(): void {
  this.adminService.getCategories().subscribe(
    data => {
      this.categories = data;
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
  
}

fetchSubCategories(): void {
  this.adminService.getSubCategories().subscribe(
    (data: any) => {  
      this.subCategories = data.results; 
    },
    error => {
      console.error('Error fetching subcategories:', error);
    }
  );
}

selectedCategoryId: string | null = null;
onCategoryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.selectedCategoryId = target.value;
  this.editForm.get('news_sub_category_id')?.setValue('');
  this.fetchSubCategoriesByCategoryId(this.selectedCategoryId);
  
}



filteredSubCategories: any[] = [];

fetchSubCategoriesByCategoryId(categoryId: string): void {
  this.adminService.getSubcategoriesbyId(categoryId).subscribe(
    (data: any) => {
      this.filteredSubCategories = data.results;
    },
    error => {
      console.error('Error fetching subcategories by category ID:', error);
    }
  );

}



onSubCategoryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const selectedSubCategoryId = target.value;

}


audioFileList: NzUploadFile[] = []; 


handleAudioFileChange(event: NzUploadChangeParam): void {
  if (event.file.status === 'done' || event.file.status === 'uploading') {
    const file = event.file.originFileObj as File;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Audio = reader.result as string;

        const base64String = base64Audio.split(',')[1];

        
        this.editForm.patchValue({
          audio_location: base64String
        });
      };
      reader.readAsDataURL(file); 
    }
  } else if (event.file.status === 'error') {
    console.error('Audio upload failed:', event.file.response);
  }
}



profile_pic: any;

profileImage: string | ArrayBuffer | null = null;
audioBase64: string | ArrayBuffer | null = null;

image_location:any;


fetchNewsData() {
  this.adminService.getNewsById(this.newsId).subscribe((data: any) => {
    this.editForm.patchValue({
      headline: data.headline,
      desc: data.desc,
      short_description: data.short_description,
      status: data.status,
      location: data.location,
      category_id: data.category_id,
      language:data.language,
      is_published:data.is_published,
      // publish_at:data.publish_at,
      media:data.media,
      news_sub_category_id: data.news_sub_category_id,
      image_location: [this.profileImage], // Keep image_location as an array if needed
      audio_location: this.audioBase64 // Set audio_location as a single string
    });
console.log("patchvalues",this.editForm.value)
    // Convert image to base64
    this.fetchSubCategoriesByCategoryId(data.category_id);
    this.image_location = data.image_location;
    if (this.image_location) {
      this.convertToBase64(this.image_location)
        .then(base64 => {
          this.profileImage = base64;
          this.editForm.patchValue({ image_location: [base64] }); // Keep image as an array if needed
        })
        .catch(error => {
          console.error("Error converting image to base64:", error);
        });
    }

    // Convert audio to base64 and assign as a string
    if (data.audio_location) {
      this.convertToBase64(data.audio_location)
        .then(base64 => {
          this.audioBase64 = base64;
          this.editForm.patchValue({ audio_location: base64 }); // Set as a single string
        })
        .catch(error => {
          console.error("Error converting audio to base64:", error);
        });
    }
  });
}




convertToBase64(url: string): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const cleanBase64 = base64String.replace(/^data:(application\/octet-stream|image\/[a-z]+);base64,/, '');
        resolve(cleanBase64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}





onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64StringWithPrefix = reader.result?.toString() || '';
      const base64String = base64StringWithPrefix.split(',')[1];
      this.profileImage = base64String;
      this.editForm.patchValue({
        image_location: [base64String] 
      });
    };
    reader.readAsDataURL(file);
  }
}


triggerFileInput() {
  const fileInput = document.getElementById('profile_pic') as HTMLElement;
  fileInput.click();
}

onImageError(event: any) {
  event.target.src = 'assets/profile1.webp'; // Set path to your default image
}




onAudioFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64StringWithPrefix = reader.result?.toString() || '';
      const base64String = base64StringWithPrefix.split(',')[1];
      this.audioBase64 = base64String;
      this.editForm.patchValue({
        audio_location: base64String // Update form control as an array
      });
    };
    reader.readAsDataURL(file); // Read audio file as base64
  }
}

triggerAudioInput() {
  const audioInput = document.getElementById('audio_file') as HTMLElement;
  audioInput.click();
}

// LanguageOptions:any[]=[];
// getAllLanguages(): void {
//     console.log("fetch");
//     this.adminService.Getalllanguages().subscribe(
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
