import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// AG Grid modül sistemini kaydet
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';

// Kullanacağın AG Grid modüllerini buraya ekle
ModuleRegistry.registerModules([
  ClientSideRowModelModule,

]);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
