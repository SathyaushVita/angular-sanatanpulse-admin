import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminpageService } from '../adminpage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productionupdate',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './productionupdate.component.html',
  styleUrl: './productionupdate.component.css'
})
export class ProductionupdateComponent {
  
  
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
      news_sub_category_id: ['',Validators.required],
      image_location: ['',Validators.required],
      audio_location: ['',Validators.required],
      language: ['88aff31a-23c4-11ef-85c8-00e04ca50182'],
      publish_at: [new Date().toISOString().substring(0, 16)],
      is_published:['']
    
    
    });

    this.fetchNewsData();
    this.fetchCategories();
    this.fetchSubCategories();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",this.editForm.value)
      this.adminService.updateNewsProduction(this.newsId, this.editForm.value).subscribe(
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




profile_pic: any;

profileImage: string | ArrayBuffer | null = null;
audioBase64: string | ArrayBuffer | null = null;

image_location:any;

fetchNewsData() {
  this.adminService.getNewsByProduction(this.newsId).subscribe((data: any) => {
    this.editForm.patchValue({
      headline: data.headline,
      desc: data.desc,
      short_description: data.short_description,
      status: data.status,
      location: data.location,
      is_published:data.location,
      // publish_at:data.publish_at,
      category_id: data.category_id ? data.category_id._id : '', // Check for null
      news_sub_category_id: data.news_sub_category_id ? data.news_sub_category_id._id : '', // Check for null
  
      image_location: [this.profileImage], // Keep image_location as an array if needed
      audio_location: this.audioBase64 // Set audio_location as a single string
    });
    if (data.category_id) {
      this.fetchSubCategoriesByCategoryId(data.category_id._id); // Fetch subcategories for the category
    }
    // this.fetchSubCategoriesByCategoryId(data.category_id);
    // Convert image to base64
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
}
