import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminpageService } from '../adminpage.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-memberprofile',
  standalone: true,
  imports: [CommonModule,NzUploadModule,ReactiveFormsModule,FormsModule],
  templateUrl: './memberprofile.component.html',
  styleUrl: './memberprofile.component.css'
})
export class MemberprofileComponent {
  profileForm: FormGroup;
  selectedFile: File | null = null;
  user_id: any;
  userId: any;
  bannerFileList: NzUploadFile[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private newsService: AdminpageService,
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<MemberprofileComponent>
  ) {
    this.profileForm = this.fb.group({
      // full_name: ['', Validators.required],
      // first_name: ['', Validators.required],
      // last_name: ['', Validators.required],
      full_name: ['', Validators.required],
      surname: ['', Validators.required],
      // email: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      father_name: ['', Validators.required],
      profile_pic: ['', Validators.required],
      contact_number: ['', Validators.required],
      gender: ['MALE', Validators.required],
      dob: [],
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || this.authService.getUserId();
    console.log('Route param userId:', this.route.snapshot.paramMap.get('id'));
    console.log('Stored userId:', this.authService.getUserId());

    if (this.userId) {
      this.profileForm.patchValue({ user_id: this.userId });
    } else {
      console.error('User ID is missing.');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const profileData = new FormData();
      Object.keys(this.profileForm.value).forEach(key => {
        profileData.append(key, this.profileForm.value[key]);
      });

      const token = this.authService.getToken();
      this.userId = this.authService.getUserId();
      console.log(this.userId, 'fdyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');

      if (token) {
        this.newsService.updateProfile(profileData, token, this.userId).subscribe(
          response => {
            console.log('Profile updated successfully', response);
            // this.router.navigate(['/addnews']);
            this.dialogRef.close(this.profileForm.value); 
          },
          error => {
            console.error('Error updating profile', error);
          }
        );
      } else {
        console.error('No access token found. Please log in.');
      }
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  handleBannerFileChange(info: NzUploadChangeParam): void {
    this.handleUpload(info, 'profile_pic');
  }

  handleUpload(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];

    fileList.forEach((file: NzUploadFile) => {
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        this.profileForm.patchValue({ [formControlName]: base64String });
      });
    });

    this.profileForm.get(formControlName)?.setValue(fileList);

    if (formControlName === 'profile_pic') {
      this.bannerFileList = fileList;
    }
  }

  getBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;
      // Extract base64 string without the data URI scheme
      base64String = base64String.split(',')[1];
      console.log('Base64 string:', base64String); // Print base64 string
      callback(base64String);
    };
    reader.readAsDataURL(file);
  }
}
