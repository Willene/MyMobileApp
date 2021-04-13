import { Component, OnInit } from '@angular/core';
import { IonItemSliding, NavController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { IUserInfo } from '../auth/user-info.model';
import { AuthActions, IAuthAction } from 'ionic-appauth';
import { Subscription } from 'rxjs';
import { ExpensesService } from './expenses.service';
import { Router } from '@angular/router';
import { Expense } from './expense.model';

@Component({
  selector: 'app-expenses',
  templateUrl: 'expenses.page.html'
})
export class ExpensesPage implements OnInit {
  userInfo: IUserInfo;
  action: IAuthAction;
  authenticated: boolean;

  expenses: Expense[];
  expensesToApprove: Expense[];

  isLoading = false;

  private expensesSub: Subscription;
  private expensesToApproveSub: Subscription;

  constructor(private navCtrl: NavController, 
    private authService: AuthService,
    private expensesService: ExpensesService,
    private router: Router) {
  }

  ngOnInit() {
    this.authService.authObservable.subscribe((action) => {
      this.action = action;
      if (action.action === AuthActions.SignInSuccess || action.action === AuthActions.AutoSignInSuccess) {
        this.authenticated = true;
      } else if (action.action === AuthActions.SignOutSuccess) {
        this.authenticated = false;
      }
    });

    this.expensesSub = this.expensesService.Expenses.subscribe(expenses => {
      this.expenses = expenses;
    });

    this.expensesToApproveSub = this.expensesService.ExpensesToApprove.subscribe(expenses => {
      this.expensesToApprove = expenses;
    });
  }

  signOut() {
    this.authService.signOut();
  }

  signIn() {
    this.authService.signIn().catch(error => console.error(`Sign in error: ${error}`));
  }

  public async getUserInfo(): Promise<void> {
    this.userInfo = await this.authService.getUserInfo<IUserInfo>();
  }

  onEdit(id: string, slidingitem: IonItemSliding) {
    slidingitem.close();
    this.router.navigate(['/', 'tabs', 'expenses', 'edit', id]);
    console.log(id);
  }

  ngOnDestroy() {
    if (this.expensesSub) {
      this.expensesSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.expensesService.fetchExpenses().subscribe(() => {
      
    this.expensesService.fetchExpensesToApprove().subscribe(() => {
      this.isLoading = false;
    });
  });
  }
}
