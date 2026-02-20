import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MemberprofileComponent } from '../memberprofile/memberprofile.component';
// import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { AdminpageService } from '../adminpage.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  constructor(
    private dialog: MatDialog,
    public authService:AuthService,
    private router: Router,private newsservice:AdminpageService
  ){
    
  }

  // isLoggedIn: boolean = false;
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }




  openLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { displayName: 'signup' }, 
      autoFocus: false, 
      backdropClass: 'dialog-backdrop',
    });
    
    dialogRef.afterClosed().subscribe(() => {
      
    });
  }




  

  logout(): void {
    this.authService.logout();
  }

  sidebarOpen: boolean = false;
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }




  openProfileDialog(): void {
    const dialogRef = this.dialog.open(MemberprofileComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Profile updated successfully', result);
        if (result === 'success') {
        }
      }
    });
  }


  loginaddnews(): void {
    if (!this.isLoggedIn()) {
      
      this.openLogin();
    } else {
      
      this.router.navigate(['/addnews']);
    }
    
  }




  production(){
    if (!this.isLoggedIn()) {
      
      this.openLogin();
    } else {
      
      this.router.navigate(['/production']);
    }

  }

  // loginaddnews(): void {
  //   if (!this.authService.isLoggedIn()) {
  //     const dialogRef = this.dialog.open(LoginComponent);
      
      
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result === 'success') {

  //         this.router.navigate(['/addnews']);
  //       }
  //     });
  //   } else {
  //     this.router.navigate(['/addnews']);
  //   }
  // }
  
 
  navigateTo(route: string): void {
    const ismember = localStorage.getItem('is_member') === 'true'; 
    console.log("hsjfdjdkjfkdfjhdhfu",ismember)
  
    if (ismember) {
      this.router.navigate([route]);
    } 
  }
  


}
