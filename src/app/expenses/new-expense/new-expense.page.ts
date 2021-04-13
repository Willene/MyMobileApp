import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpensesService } from '../expenses.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.page.html',
})
export class NewExpensePage implements OnInit {
  form: FormGroup;

  constructor(private expensesService: ExpensesService,
              private router: Router,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      category: new FormControl(null,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }
      ),
      date: new FormControl(null,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }
      ),
      amount: new FormControl(null,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }
      ),
      currency: new FormControl(null,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }
      ),
      description: new FormControl(null,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }
      ),
      reason: new FormControl(null,
        {
          updateOn: 'blur',
          validators: [Validators.required]
        }
      )
    });
  }

  onCreateExpense() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Creating expense...'
    }).then(loadingEL => {
      loadingEL.present();
      this.expensesService.addExpense(this.form.value.category, this.form.value.date, this.form.value.amount, this.form.value.currency, true,
        this.form.value.description, this.form.value.reason, false, '', '', undefined, 'willeneleroux@gmail.com', 'johnsmith@gmail.com').subscribe(() => {
          loadingEL.dismiss();
          this.form.reset();
          this.router.navigate(['tabs/expenses']);
        });
    });
  }
}
