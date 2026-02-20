import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminpageService } from '../adminpage.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,ParamMap } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './production.component.html',
  styleUrl: './production.component.css'
})
export class ProductionComponent {
  constructor(private adminservice:AdminpageService,private router: Router,private route:ActivatedRoute, public authService:AuthService,
    private dialog: MatDialog,){}

  ngOnInit() {
    this.fetchproductiondata();
    this.fetchCategories();
  }

  productionnews:any;
//   fetchproductiondata(): void {
//     this.adminservice.productionnews().subscribe(
//       (data) => {
//         this.productionnews = data.results;
//       },
//       (error) => {
//         console.error('Error fetching news:', error);
//       }
//     );
// }
totalPages: number = 0;
currentPage: number = 1;
pageSize: number = 50;

fetchproductiondata(pageNumber: number = 1): void {
  this.adminservice.productionnews(pageNumber).subscribe(
    (data) => {
      this.productionnews = data.results; // Assuming 'results' contains the fetched data
      this.totalPages = data.total_pages; // Assuming 'total_pages' is provided by the API
      this.currentPage = pageNumber;
      console.log("Fetched production data:", this.productionnews);
    },
    (error) => {
      console.error('Error fetching production data:', error);
    }
  );
}


// agdsvhagvdwrwerwrw

// deleteProduction(id: any): void {
//   if (confirm('Are you sure you want to delete this production data?')) {
//     this.adminservice.deleteFromProduction(id).subscribe(
//       response => {
//         console.log('Production data deleted successfully:', response);

        
//         this.productionnews(this.currentPage);
//       },
//       error => {
//         console.error('Error deleting production data:', error);
//       }
//     );
//   }
// }


deleteProduction(id: any): void {
  if (!this.authService.isLoggedIn()) {
    this.openLogin();
    return;
  }
  if (confirm('Are you sure you want to delete this production data?')) {
    this.adminservice.deleteFromProduction(id).subscribe(
      response => {
        console.log('Production data deleted successfully:', response);
        if (this.displayName === 'staging') {
          this.productionnews(this.currentPage);
        } else if (this.displayName === 'filter') {
          this.applyFilterproduction(this.selectedSubCategoryId, this.selectedDateFilter);
        }
        // Call fetchproductiondata to reload the data after deletion
        this.fetchproductiondata(this.currentPage);
      },
      error => {
        console.error('Error deleting production data:', error);
      }
    );
  }
}


undoFromProductiondb(id: any): void {
  if (!this.authService.isLoggedIn()) {
    this.openLogin(); 
    return;
  }
  if (confirm('Are you sure you want to perform the undo?')) {
    this.adminservice.UndoFromProduction(id).subscribe(
      response => {
        console.log('Production data deleted successfully:', response);
        this.fetchproductiondata(this.currentPage);
      },
      error => {
        console.error('Error deleting production data:', error);
      }
    );
  }
}



getCategoryName(id: string): string {
  const category = this.categories.find((cat: any) => cat._id === id);
  return category ? category.name : 'No category';
}

getSubCategoryName(id: string): string {
  const subCategory = this.subCategories.find((subCat: any) => subCat._id === id);
  return subCategory ? subCategory.name : 'No subcategory';
}

displayName: string = 'production'; 
production() {
  this.displayName = 'production';
}
filter() {
  this.displayName = 'filter';
}
categories: any[] = [];
  subCategories: any[] = [];
  filteredSubCategories: any[] = [];
  filteredNews: any[] = [];
  selectedCategoryId: string | null = null;
  selectedSubCategoryId: string | null = null;
  selectedDateFilter: string | null = null;

dateFilters = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'Yesterday' },
  { label: 'Week ago', value: 'Week ago' },
  { label: '2 Weeks ago', value: '2 Weeks ago' },
  { label: '3 Weeks ago', value: '3 Weeks ago' },
  { label: 'This Month', value: 'This Month' },
  { label: 'Last Month', value: 'last_month' },
  { label: '2 Months ago', value: '2 Months ago' },
  { label: '3 Months ago', value: '3 Months ago' },
  { label: 'Select Date', value: 'date_picker' },
  // {DatePicker :'Date(DD-MM-YYYY) '},
];


fetchCategories(): void {
  this.adminservice.getCategories().subscribe(
    (data) => {
      this.categories = data;
    },
    (error) => {
      console.error('Error fetching categories:', error);
    }
  );
}

fetchSubCategoriesByCategoryId(categoryId: string): void {
  this.adminservice.getSubcategoriesbyId(categoryId).subscribe(
    (data: any) => {
      this.filteredSubCategories = data.results;
    },
    (error) => {
      console.error('Error fetching subcategories by category ID:', error);
    }
  );
}

onCategoryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.selectedCategoryId = target.value;
  this.fetchSubCategoriesByCategoryId(this.selectedCategoryId);
  this.selectedSubCategoryId = null;
  this.selectedDateFilter = null;
  this.applyFilterproduction();
}

onSubCategoryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.selectedSubCategoryId = target.value;
  this.applyFilterproduction(this.selectedSubCategoryId, this.selectedDateFilter);
}

onDateFilterChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.selectedDateFilter = target.value;
  this.applyFilterproduction(this.selectedSubCategoryId, this.selectedDateFilter);
}

selectedDate: string | null = null;
applyFilterproduction(subcategoryId?: string | null, dateFilter?: string | null): void {
  if (this.selectedCategoryId) {
   
    const formattedDate = dateFilter === 'date_picker' ? this.selectedDate : dateFilter;

    this.adminservice.getFilteredNewsProduction(
      this.selectedCategoryId,
      subcategoryId || undefined,
      formattedDate || undefined 
    ).subscribe(
      (filteredNews: any) => {
        this.filteredNews = filteredNews.results;
        console.log(this.filteredNews);
      },
      (error) => {
        console.error('Error applying filter:', error);
      }
    );
  } else {
    console.error('No category selected');
  }
}

onDateSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  this.selectedDate = inputElement?.value; 
  console.log('Selected Date:', this.selectedDate);
  this.applyFilterproduction(this.selectedSubCategoryId, this.selectedDate);
}

editNews(id: string): void {
  if (!this.authService.isLoggedIn()) {
    this.openLogin(); 
    return;
  }
  this.router.navigate(['/productionedit', id]);
}
updateProduction(id: string): void {
  if (!this.authService.isLoggedIn()) {
    this.openLogin(); 
    return;
  }
  this.router.navigate(['/production-updated', id]);
}
showFullInfo: boolean = false; 

  
toggleContent(news: any): void {
  news.isExpanded = !news.isExpanded; 
  this.showFullInfo = true; 
}




selectedNews: any;
// view(newsId: string) {
//   if (!this.authService.isLoggedIn()) {
//     this.openLogin(); 
//     return;
//   }
//   this.displayName = 'view';  
//   this.selectedNews = this.productionnews.find((news:any)=> news._id === newsId);
//   console.log("Image Location vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv:", this.selectedNews?.image_location);
// }


view(newsId: string) {
  if (!this.authService.isLoggedIn()) {
        this.openLogin(); 
        return;
      }
  
  this.displayName = 'view';  
  this.selectedNews = this.productionnews.find((news:any)=> news._id === newsId);
}

imageError(event: any) {
  console.log("Image failed to load:", event.target.src);
  event.target.src = 'assets/defaultiimage'; // Fallback image
}

backtostaging() {
  this.displayName = 'production'; 
  this.selectedNews = null; 
}

filterview(newsItem: string) {
  if (!this.authService.isLoggedIn()) {
    this.openLogin(); 
    return;
  }
  console.log("wwwwwwwwwwwwwwwww",newsItem)
  this.displayName = 'view';  
  this.selectedNews = this.filteredNews.find((news:any)=> news._id === newsItem);
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",this.selectedNews )
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


}
