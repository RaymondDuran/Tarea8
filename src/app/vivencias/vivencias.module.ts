import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VivenciasPageRoutingModule } from './vivencias-routing.module';

import { VivenciasPage } from './vivencias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VivenciasPageRoutingModule
  ],
  declarations: [VivenciasPage]
})
export class VivenciasPageModule {}
