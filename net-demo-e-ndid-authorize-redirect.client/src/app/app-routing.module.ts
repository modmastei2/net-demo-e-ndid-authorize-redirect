import { RouterModule, Routes } from "@angular/router";
import { LandingPageComponent } from "./components/pages/landing-page/landing-page.component";
import { NgModule } from "@angular/core";

const routes : Routes = [
    {
        path: '',
        component: LandingPageComponent
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}