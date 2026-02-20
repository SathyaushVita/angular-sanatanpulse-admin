import { Routes } from '@angular/router';

import { AddcontainerComponent } from './addcontainer/addcontainer.component';

import { StagingComponent } from './staging/staging.component';

import { EditnewsComponent } from './editnews/editnews.component';
import { ProductionComponent } from './production/production.component';

import { MemberprofileComponent } from './memberprofile/memberprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductioneditComponent } from './productionedit/productionedit.component';
import { StagingupdateComponent } from './stagingupdate/stagingupdate.component';
import { ProductionupdateComponent } from './productionupdate/productionupdate.component';
import { OttplatformComponent } from './ottplatform/ottplatform.component';
import { AddOttMovieComponent } from './add-ott-movie/add-ott-movie.component';
import { UpdateottPlatformDetailsComponent } from './updateott-platform-details/updateott-platform-details.component';


export const routes: Routes = [
    { path: '', redirectTo: 'staging', pathMatch: 'full' },
    {path:'addnews',component:AddcontainerComponent},
    {path:'staging',component:StagingComponent},
    // {path:'header',component:HeaderComponent},
    { path: 'edit-news/:id', component: EditnewsComponent },
    {path:'production',component:ProductionComponent} ,
    // {path:'login',component:LoginComponent},
    {path:"profile",component:MemberprofileComponent},
    {path:'userdetails',component:ProfileComponent},
    {path:'productionedit/:id',component:ProductioneditComponent},
    {path:'stagingupdate/:id',component:StagingupdateComponent},
    {path:'production-updated/:id',component:ProductionupdateComponent},
    {path:'ottplatform',component:OttplatformComponent},
    {path:'Add-content',component:AddOttMovieComponent},
    {path:'updatecontent/:id',component:UpdateottPlatformDetailsComponent   }
    

];
