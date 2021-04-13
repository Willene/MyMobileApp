import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpensesPage } from './expenses.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ExpenseItemComponent } from './expense-item/expense-item.component';
import { ExpensesPageRoutingModule } from './expenses-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ExpensesPageRoutingModule
  ],
  declarations: [ExpensesPage, ExpenseItemComponent]
})
export class ExpensesPageModule {}
