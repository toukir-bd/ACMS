import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { 
  FixedIDs,
} from './index';



const routes: Routes = [
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyChainRoutingModule { }
