


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminpageService } from '../adminpage.service';

@Component({
  selector: 'app-updateott-platform-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './updateott-platform-details.component.html',
  styleUrl: './updateott-platform-details.component.css'
})
export class UpdateottPlatformDetailsComponent {

  profileForm!: FormGroup;

  userId: any;
  profileImage: string = "";   
  poster: any;

  platforms: any;
  generes: any;
  categories: any;
  languages:any

  profileData: any = null;

  categoriesLoaded = false;
  platformsLoaded = false;
  generesLoaded = false;
  profileLoaded = false;
  LanguageLoaded= false;

  constructor(
    private fb: FormBuilder,
    private adminservice: AdminpageService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {

    const movieId = this.route.snapshot.paramMap.get('id');
    this.userId = movieId;

    this.profileForm = this.fb.group({
      title: ['', Validators.required],
      release_date: ['', Validators.required],
      status: 'SUCCESS',
      cast: ['', Validators.required],
      geners_id: [''],
      platform_id: [''],
      header_id: ['', Validators.required],
      poster: [''],
      trailer: [''],
      trailer_link:[''],
      language:['']
    });

    if (movieId) {
      this.getProfileData(movieId);
    }

    this.fetchheaderCategories();
    this.fetchplatforms();
    this.fetchgeneres();
    this.fetchlanguages();
  }


  getProfileData(id: string) {
    this.adminservice.movieedata(id).subscribe((response: any) => {

      this.profileData = response.result || response;
      this.profileLoaded = true;

      this.poster = this.profileData.poster;

      if (this.poster) {
        this.convertToBase64(this.poster).then(base64 => {
          this.profileImage = base64;
          this.profileForm.patchValue({ poster: base64 });
          this.tryPatchForm();
        });
      } else {
        this.tryPatchForm();
      }
    });
  }



  convertToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const full = reader.result as string;
        resolve(full.split(',')[1]);  // remove prefix
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.responseType = 'blob';
    xhr.open('GET', url);
    xhr.send();
  });
}


  tryPatchForm() {
    if (
      this.categoriesLoaded &&
      this.platformsLoaded &&
      this.generesLoaded &&
      this.profileLoaded &&
      this.profileData
    ) {
      this.profileForm.patchValue({
        title: this.profileData.title,
        release_date: this.profileData.release_date,
        cast: this.profileData.cast,
        geners_id: this.profileData.geners_id,
        platform_id: this.profileData.platform_id,
        header_id: this.profileData.header_id,
        trailer: this.profileData.trailer,
        language: this.profileData.language,
        trailer_link: this.profileData.trailer_link,

        poster: this.profileImage
      });
    }
  }


  fetchheaderCategories() {
    this.adminservice.movieheaders().subscribe(
      data => {
        this.categories = data;
        this.categoriesLoaded = true;
        this.tryPatchForm();
      }
    );
  }

  fetchplatforms() {
    this.adminservice.movieplatforms().subscribe(
      data => {
        this.platforms = data.result;
        this.platformsLoaded = true;
        this.tryPatchForm();
      }
    );
  }

  fetchgeneres() {
    this.adminservice.moviegeners().subscribe(
      data => {
        this.generes = data.result;
        this.generesLoaded = true;
        this.tryPatchForm();
      }
    );
  }

      fetchlanguages() {
    this.adminservice.Fetchlanguages().subscribe(
      (response) => {
        this.languages = response;
         this.LanguageLoaded = true;
        this.tryPatchForm();
      },
      (error) => {
        console.error("Error loading geners", error);
      }
    );
  }


  updateProfile() {
    if (this.profileForm.valid) {

      const payload = {
        ...this.profileForm.value,
        poster: this.profileImage
      };

      this.adminservice.updatemovie(payload, this.userId).subscribe(
        res => {
          console.log("Updated Successfully", res);
          this.router.navigate(['/ottplatform']);
        },
        err => {
          console.error("Update failed", err);
        }
      );
    } else {
      this.profileForm.markAllAsTouched();
    }
  }




onFileChange(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64Full = reader.result as string;

    // Remove prefix (VERY IMPORTANT)
    const cleanBase64 = base64Full.split(',')[1];

    this.profileImage = cleanBase64;    
    this.profileForm.patchValue({ poster: cleanBase64 });
  };
  reader.readAsDataURL(file);
}



  triggerFileInput() {
    document.getElementById('poster')!.click();
  }

  onImageError(event: any) {
    event.target.src = 'assets/profile1.webp';
  }
}
