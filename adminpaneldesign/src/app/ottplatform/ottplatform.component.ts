import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminpageService } from '../adminpage.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
declare var bootstrap: any;
@Component({
  selector: 'app-ottplatform',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './ottplatform.component.html',
  styleUrl: './ottplatform.component.css'
})
export class OttplatformComponent {



searchTerm: string = '';
searchSubject = new Subject<string>();

selectedPlatformId: string = '';
selectedHeaderId: string = '';
selectedGenerId: string = '';
selectedLanguageId:string = '';

moviesList: any[] = [];
movieHeaders: any[] = [];
moviePlatforms: any[] = [];
movieGeners: any[] = [];
languages:any;


constructor(private ottplatformservice:AdminpageService,private sanitizer: DomSanitizer,private router: Router,private dialog: MatDialog,
  public authService:AuthService,
) {}

ngOnInit() {
    this.loadHeaders();
    this.loadPlatforms();
    this.loadGeners();
    this.loadMovies();
    this.fetchlanguages();
  }

onSearchChange(term: string) {
  this.searchTerm = term;
  this.loadMovies();
}





loadMovies() {

  if (this.selectedPlatformId && this.selectedHeaderId && this.selectedGenerId) {
    this.ottplatformservice.ottplatform(
      this.selectedPlatformId,
      this.selectedHeaderId,
      this.selectedGenerId,
      this.selectedLanguageId || '',
      this.searchTerm
    ).subscribe(
      (response) => {
        this.moviesList = response.result;
        console.log("Platform + Header + Gener + Search:", this.moviesList);
      },
      (error) => console.error(error)
    );
    return;
  }

  if (this.selectedPlatformId && this.selectedHeaderId) {
    this.ottplatformservice.ottplatform(
      this.selectedPlatformId,
      this.selectedHeaderId,
      '',
      this.selectedLanguageId || '',
      this.searchTerm
    ).subscribe(
      (response) => {
        this.moviesList = response.result;
        console.log("Platform + Header:", this.moviesList);
      },
      (error) => console.error(error)
    );
    return;
  }

  if (this.selectedPlatformId) {
    this.ottplatformservice.ottplatform(
      this.selectedPlatformId,
      '',
      '',
      this.selectedLanguageId || '',
      this.searchTerm
    ).subscribe(
      (response) => {
        this.moviesList = response.result;
        console.log("Only Platform:", this.moviesList);
      },
      (error) => console.error(error)
    );
    return;
  }

  if (this.selectedHeaderId) {
    this.ottplatformservice.ottplatform(
      '',
      this.selectedHeaderId,
      '',
      this.selectedLanguageId || '',
      this.searchTerm
    ).subscribe(
      (response) => {
        this.moviesList = response.result;
        console.log("Only Header:", this.moviesList);
      },
      (error) => console.error(error)
    );
    return;
  }

  if (this.selectedGenerId) {
    this.ottplatformservice.ottplatform(
      '',
      '',
      this.selectedGenerId,
      this.selectedLanguageId || '',
      this.searchTerm
    ).subscribe(
      (response) => {
        this.moviesList = response.result;
        console.log("Only Gener:", this.moviesList);
      },
      (error) => console.error(error)
    );
    return;
  }

  this.ottplatformservice.ottplatform(
    '',
    '',
    '',
    this.selectedLanguageId || '',
    this.searchTerm
  ).subscribe(
    (response) => {
      this.moviesList = response.result;
      console.log("Default Movie List:", this.moviesList);
    },
    (error) => console.error(error)
  );


    this.ottplatformservice .ottplatform('', '', '','', this.searchTerm) .subscribe(
      (response) => {
        this.moviesList = response.result;
        console.log("Default Movie List:", this.moviesList);
      },
      (error) => console.error(error)
    );

}



  loadHeaders() {
    this.ottplatformservice.movieheaders().subscribe(
      (response) => {
        this.movieHeaders = response;
      },
      (error) => {
        console.error("Error loading headers", error);
      }
    );
  }

  loadPlatforms() {
    this.ottplatformservice.movieplatforms().subscribe(
      (response) => {
        this.moviePlatforms = response.result;
      },
      (error) => {
        console.error("Error loading platforms", error);
      }
    );
  }

  loadGeners() {
    this.ottplatformservice.moviegeners().subscribe(
      (response) => {
        this.movieGeners = response.result;
      },
      (error) => {
        console.error("Error loading geners", error);
      }
    );
  }


    fetchlanguages() {
    this.ottplatformservice.Fetchlanguages().subscribe(
      (response) => {
        this.languages = response;
      },
      (error) => {
        console.error("Error loading geners", error);
      }
    );
  }

onFilterChange() {
  this.loadMovies();
}




handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/ottplatform.webp';
}




getVideoUrl(movie: any): SafeResourceUrl {
  if (movie?.trailer) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(movie.trailer);
  }
  return '';
}



safeTrailerUrl!: SafeResourceUrl;
selectedMovieTitle: string = '';

openTrailer(movie: any) {
  this.selectedMovieTitle = movie.title;

  this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(movie.trailer);

  const modalElement = document.getElementById('trailerModal');
  const modal = new bootstrap.Modal(modalElement!);
  modal.show();
}






    goToAddContent(): void {
    if (!this.isLoggedIn()) {
      
      this.openLogin();
    } else {
      
      this.router.navigate(['/Add-content']);
    }
  }
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


    deleteMovie(id: string): void {

        if (!this.authService.isLoggedIn()) {
    this.openLogin(); 
    return;
  }
    if (!confirm("Are you sure you want to delete this movie?")) return;

    this.ottplatformservice.deletemovie(id).subscribe(
      (res) => {
        console.log("Movie Deleted:", res);

        // Remove deleted movie from table instantly
        this.moviesList = this.moviesList.filter(m => m._id !== id);
      },
      (err) => {
        console.error("Delete Failed:", err);
      }
    );
  }


onEdit(id: string) {
  this.router.navigate(['/updatecontent', id]);
}



// moveToProduction(id: any) {
//           if (!this.authService.isLoggedIn()) {
//     this.openLogin(); 
//     return;
//   }

//   this.ottplatformservice.Staggingtoproductiommove(id).subscribe({
//     next: (res) => {
//       alert("Successfully moved to production!");
//       this.loadMovies(); // refresh list
//     },
//     error: (err) => {
//       console.error(err);
//       alert("Failed to move!");
//     }
//   });
// }


moveToProduction(id: any) {

  // 1. Check if user is logged in
  if (!this.authService.isLoggedIn()) {
    this.openLogin();
    return;
  }

  // 2. Ask user confirmation before API call
  const confirmMove = confirm("Are you sure you want to move this movie to production?");
  if (!confirmMove) {
    console.log("User cancelled the action.");
    return;  // STOP here if user clicks Cancel
  }

  // 3. If user confirms → Call API
  this.ottplatformservice.Staggingtoproductiommove(id).subscribe({
    next: (res) => {
      alert("Successfully moved to production!");
      this.loadMovies();  // Refresh table list
    },
    error: (err) => {
      console.error(err);
      alert("Failed to move movie to production.");
    }
  });
}



}

