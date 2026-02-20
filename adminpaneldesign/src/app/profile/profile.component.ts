import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminpageService } from '../adminpage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
// user: any = {};
user: any = [];
news: any[] = [];
articles: any[] = [];


  constructor(private newsservice:AdminpageService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  // getUserProfile(): void {
  //   const userId = localStorage.getItem('user_id'); 
  //   this.newsservice.Getprofile(userId).subscribe(
  //     (data) => {
  //       this.user = data;
  //       console.log("11111111111111111",this.user)
  //     },
  //     (error) => {
  //       console.error('Error fetching user data:', error);
  //     }
  //   );
  // }

  
getUserProfile(): void {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    console.error('User ID not found in localStorage.');
    return;
  }

  this.newsservice.Getprofile(userId).subscribe({
    next: (data: any) => {
      if (data && data.length > 0) {
        this.user = data[0];
        // this.news = this.user.news || []; 
        // this.articles = this.user.articles || [];
        // console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu",this.news) 
      } else {
        console.warn('No user data returned from API.');
      }
    },
    error: (error) => {
      console.error('Error fetching user data:', error);
    },
    complete: () => {
    }
  });
}
}
