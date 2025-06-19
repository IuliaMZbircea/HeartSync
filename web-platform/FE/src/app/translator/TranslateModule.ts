import { NgModule } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {CustomLoader} from "./translator";

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClient]
      }
    })
  ],
  exports: [TranslateModule]
})
export class AppTranslationModule {}
