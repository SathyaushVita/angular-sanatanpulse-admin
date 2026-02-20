import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { URL } from './constants';
import { DateFilter } from './date-filter.enum';
import { Observable } from 'rxjs'; // Import Observable
import { BehaviorSubject } from 'rxjs';
import {HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminpageService {


  constructor(private http:HttpClient) {} 




  // now modifications
  visitedNews:any[]=[];
  savedNews: any[] = []; 

  // Getdata():Observable<any>{
  //   console.log("wefhm")
  //   return this.http.get("http://127.0.0.1:8000/hindupulse/Staging_db/");
  // }


  Getdata(pageNumber: number = 1, pageSize: number = 50): Observable<any> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('page_size', pageSize.toString());
  
    return this.http.get(URL+"Staging_db/", { params });
  }
  


  // private baseUrl = 'http://127.0.0.1:8000/hindupulse/staging-to-production/transfer_to_production/';
  // transferData(id: any): Observable<any> {
  // return this.http.post<any>(`${this.baseUrl}${id}/`, {});
  // }



  private baseUrl = URL+'staging-to-production/transfer_to_production/';


  transferData(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${id}/`, {});
  }


  
 

  

  private apiUrls=URL+"Staging_db/"
  deleteNews(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrls}${id}/`);
  }
  


// it is working

  // productionnews():Observable<any>{
    
  //   return this.http.get(URL+"news/");
  // }

  productionnews(pageNumber: number = 1, pageSize: number = 50): Observable<any> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('page_size', pageSize.toString());
  
    return this.http.get(URL + "news/", { params });
  }
  


  
  private apiview=URL+"news/"
  deleteFromProduction(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiview}${id}/`);
  }


  getCategories(): Observable<any> {
    return this.http.get(URL+`category/`);
  }

  getSubCategories() {
    return this.http.get(URL+`sub_category/`);
  }



  getSubcategoriesbyId(categoryId: string): Observable<any> {
    return this.http.get(URL+`sub_category_by_id/${categoryId}/`);
  }



  UndoFromProduction(id: any): Observable<any> {
    return this.http.post<any>(URL+`production-to-staging/transfer_to_staging/${id}/`, {}); // Sending empty body or add any necessary data
  }


fetchingnews():Observable<any>{   
    return this.http.get(URL+"Staging_db/fetch_news/");
  }
  

//  newly started 


// Define the method for posting the form data
// addContainerData(formData: any): Observable<any> {
//   return this.http.post<any>(URL+`Staging_Post/`, formData); // Ensure you provide the body
// }


addContainerData(newsdata: any, token: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  return this.http.post(URL+"Staging_Post/", newsdata, { headers });
}


Getprofile(id:any):Observable<any>{
  return this.http.get(URL+"profile_get_by_id/"+ id + "/");
}

// getFilteredNews(categoryId: string): Observable<any> {
//   return this.http.get(URL+`staging-news-category-filter/?category_id=${categoryId}`);
// }


// Adjust `getFilteredNews` to use `string | undefined` for parameters
// filter for the staging

getFilteredNews(categoryId: string, subcategoryId?: string, createdAt?: string): Observable<any> {
  let params = new HttpParams().set('category_id', categoryId);

  if (subcategoryId) {
    params = params.set('news_sub_category_id', subcategoryId);
  }

  
  if (createdAt) {
    params = params.set('created_at', createdAt);  // Use 'created_at' as specified
  }

  return this.http.get<any>(URL + 'staging-news-category-filter/', { params });
}



getFilteredNewsProduction(categoryId: string, subcategoryId?: string, createdAt?: string): Observable<any> {
  let params = new HttpParams().set('category_id', categoryId);

  if (subcategoryId) {
    params = params.set('news_sub_category_id', subcategoryId);
  }

  
  if (createdAt) {
    params = params.set('created_at', createdAt);  // Use 'created_at' as specified
  }

  return this.http.get<any>(URL + 'news-category-filter/', { params });
  
}




geteditednews(): Observable<any> {
  return this.http.get(URL+`staging-news-category-filter/?news_status=EDITED_NEWS`);
}


Register(data:any): Observable<any> {

  return this.http.post(URL+"register/", data);
}

VerifyOtp(data: any): Observable<any> {
  return this.http.post(URL+'login/', data);
}


ResendOtp(data: any): Observable<any> {
  return this.http.post(URL+'resendotp/', data);
}


getNewsById(id : any):Observable<any>{
  return this.http.get(URL+"Staging_db/"+ id + "/");
}


private baseUrls = URL+'edit_news_staging/';

EditNewsstaging(id: string, data: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrls}${id}/`, data);
}


updateProfile(profileData: FormData, token: string,id: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.put(URL+'profile/'+id+'/', profileData, { headers });

}

getNewsByProduction(id : any):Observable<any>{
  return this.http.get(URL+"news/"+ id + "/");
}



private baseUrlsdata = URL+'edit_news_production/';

EditNewsProduction(id: string, data: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrlsdata}${id}/`, data);
}

  

  
  UpdateNewsStaging(id: string, data: any): Observable<any> {
    return this.http.put<any>(URL+`update_news_staging/${id}/`, data);
  }
  

  
  updateNewsProduction(id: string, data: any): Observable<any> {
    return this.http.put<any>(URL+`update_news_production/${id}/`, data);
  }


  // Getalllanguages():Observable<any>{
  //   return this.http
  //   .get(URL+"language/")
    
  // }

  //ottplatform


      ottplatform(platform_id: string, header_id: string,geners_id: string,language:string,search: string = '', ): Observable<any> {
    return this.http.get(`${URL}staging_movies_filter`, {
      params: {
        platform_id: platform_id,
        header_id: header_id,
        geners_id: geners_id,
        language:language,
        search: search,
      }
    });
  }

        // ottplatform(platform_id: string, header_id: string,geners_id: string,search: string = '', ): Observable<any> {
  //   return this.http.get(`${URL}movies_filter`, {
  //     params: {
  //       platform_id: platform_id,
  //       header_id: header_id,
  //       geners_id: geners_id,
  //       search: search,
  //     }
  //   });
  // }

  movieheaders():Observable<any>{
  return this.http.get(URL+"movie_header/")
  }

  movieplatforms():Observable<any>{
  return this.http.get(URL+"movie_platforms/")
  }

  moviegeners():Observable<any>{
  return this.http.get(URL+"movie_geners/")
  }

  Getallmoviedetails():Observable<any>{
  return this.http.get(URL+"movie_details/")
  }


//   Moviecontent(data:any): Observable<any> {
//   return this.http.post(URL+"movie_details/", data);
// }



  Moviecontent(moviedata: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(URL+"staging_movie_details/", moviedata, { headers });
  }


  //   Moviecontent(moviedata: any, token: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   });
  //   return this.http.post(URL+"movie_details/", moviedata, { headers });
  // }


  deletemovie(_id:any):Observable<any>{
  return this.http.delete(URL+"staging_movie_details/"+_id+'/')
  }





    updatemovie(memberData: any, userId: any): Observable<any> {
    const url = `${URL}staging_movie_details/`+userId+"/";
    const data = { ...memberData,  };
  
    return this.http.put(url, data);
  }


    movieedata(id:any): Observable<any>{
    return this.http.get(URL+"staging_movie_details/"+id+'/')
  }


 Fetchlanguages():Observable<any>{
  return this.http.get(URL+"language/")
  }

    Staggingtoproductiommove(id:any): Observable<any>{
    return this.http.get(URL+"publish-staging/"+id+'/')
  }

}




