import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminpageService } from '../adminpage.service';
import { Router } from '@angular/router';
import { DateFilter } from '../date-filter.enum';
import { ActivatedRoute,ParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
declare var bootstrap: any;



@Component({
  selector: 'app-staging',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './staging.component.html',
  styleUrl: './staging.component.css'
})
export class StagingComponent {


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
    { label: '1 week ago', value: '1 week ago' },
    { label: '2 Weeks ago', value: '2 Weeks ago' },
    { label: '3 Weeks ago', value: '3 Weeks ago' },
    { label: 'This Month', value: 'This Month' },
    { label: 'Last Month', value: 'last month' },
    { label: '2 Months ago', value: '2 Months ago' },
    { label: '3 Months ago', value: '3 Months ago' },
    { label: 'Select Date', value: 'date_picker' },
    // {DatePicker :'Date(DD-MM-YYYY) '},
  ];





  constructor(
    private adminservice: AdminpageService,
    private router: Router,
    private route: ActivatedRoute,
     public authService:AuthService,
     private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.fetchCategories();
    this.fetchstagingdata();
    this.fetchSubCategories();
  }

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
  stagingdata:any
  ids:any;
  // fetchstagingdata(): void {
  //   this.adminservice.Getdata().subscribe(
  //     (data) => {
  //       this.stagingdata = data.results;
  //       this.ids = this.medianews.map((news: any) => news._id);
        

  //       console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",this.filteredNews)
  //     },
  //     (error) => {
  //       console.error('Error fetching news:', error);
  //     }
  //   );
  // }

  
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 50;
  fetchstagingdata(pageNumber: number = 1): void {
    this.adminservice.Getdata(pageNumber).subscribe(
      (data) => {
        this.stagingdata = data.results; // Assuming the fetched data is in 'results'
        this.totalPages = data.total_pages; // Assuming the API provides 'total_pages'
        this.currentPage = pageNumber;
        console.log("Fetched staging data:", this.stagingdata);
      },
      (error) => {
        console.error('Error fetching staging data:', error);
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
    this.applyFilter();
  }

  onSubCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSubCategoryId = target.value;
    this.applyFilter(this.selectedSubCategoryId, this.selectedDateFilter);
  }

  onDateFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedDateFilter = target.value;
    this.applyFilter(this.selectedSubCategoryId, this.selectedDateFilter);
  }


applyFilter(subcategoryId?: string | null, dateFilter?: string | null): void {
  if (this.selectedCategoryId) {
    // Check if a date filter was selected
    const formattedDate = dateFilter === 'date_picker' ? this.selectedDate : dateFilter; // Use the formatted date

    this.adminservice.getFilteredNews(
      this.selectedCategoryId,
      subcategoryId || undefined,
      formattedDate || undefined // Send the correctly formatted date
    ).subscribe(
      (filteredNews: any) => {
        this.filteredNews = filteredNews.results;
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaa",this.filteredNews);
      },
      (error) => {
        console.error('Error applying filter:', error);
      }
    );
  } else {
    console.error('No category selected');
  }
}
displayName: string = 'staging'; 
staging() {
  this.displayName = 'staging';
}
filter() {
  this.displayName = 'filter';
}


// editNews(id: string): void {
//   this.router.navigate(['/edit-news', id]);
// }

editNews(id: string): void {
  if (!this.authService.isLoggedIn()) {
    this.openLogin(); 
    return;
  }
  this.router.navigate(['/edit-news', id]); 
}



updateNews(id: string): void {
  if (!this.authService.isLoggedIn()) {
    this.openLogin();
    return;
  }
  this.router.navigate(['/stagingupdate', id]);
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




deleteNews(id: any): void {
  if (!this.authService.isLoggedIn()) {
    this.openLogin(); 
    return;
  }
  const confirmed = window.confirm('Are you sure you want to delete this news item?');
  
  if (confirmed) {
    this.adminservice.deleteNews(id).subscribe(
      (response) => {
        console.log('News item deleted successfully');

        if (this.displayName === 'staging') {
          this.fetchstagingdata(this.currentPage);
        } else if (this.displayName === 'filter') {
          this.applyFilter(this.selectedSubCategoryId, this.selectedDateFilter);
        }
      },
      (error) => {
        console.error('Error deleting news item:', error);
      }
    );
  }
}



getCategoryName(id: string): string {
  const category = this.categories.find((cat: any) => cat._id === id);
  return category ? category.name : 'No category';
}

getSubCategoryName(id: string): string {
  console.log("dsldasdfhj",id)
  const subCategory = this.subCategories.find((subCat: any) => subCat._id === id);
  console.log("aaaaaaaaaaaaaaaaasdfghjkmlerrrrrrrrrrrrf",subCategory)
  return subCategory ? subCategory.name : 'No subcategory';
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

selectedDate: string | null = null;

onDateChange(): void {
  this.applyFilter(this.selectedSubCategoryId, this.selectedDate);
}

onDateSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
  this.selectedDate = inputElement?.value; // Capture selected date in YYYY-MM-DD format
  console.log('Selected Date:', this.selectedDate);
  this.applyFilter(this.selectedSubCategoryId, this.selectedDate); // Apply filter with selected date
}

medianews: any = [];


transfer(id: string) {
  if (!this.authService.isLoggedIn()) {
    this.openLogin();
    return;
  }
  console.log("Attempting to transfer item with ID:", id); 
  this.adminservice.transferData(id).subscribe(
    (response) => {
      console.log("Transfer successful:", response);
      alert('The news can be moved to the production database.');
    },
    (error) => {
      console.error("Error during transfer:", error);
      alert("Transfer failed. Please check the ID and try again.");
    }
  );
}





  showFullInfo: boolean = false; 

  
  toggleContent(news: any): void {
    news.isExpanded = !news.isExpanded; 
    this.showFullInfo = true; 
  }




  selectedNews: any;
  view(newsId: string) {
    if (!this.authService.isLoggedIn()) {
      this.openLogin(); 
      return;
    }
    console.log("wwwwwwwwwwwwwwwww",newsId)
    this.displayName = 'view';  
    this.selectedNews = this.stagingdata.find((news:any)=> news._id === newsId);

    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",this.selectedNews )
  }

  backtostaging() {
    this.displayName = 'staging'; 
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

  

}