import { Injectable } from '@angular/core';

import { Expense } from './expense.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { IExpense } from './expense.interface';
import { IUserInfo } from '../auth/user-info.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private userInfo: IUserInfo;
  private expenses = new BehaviorSubject<Expense[]>([
  ]);
  private expensesToApprove = new BehaviorSubject<Expense[]>([
  ]);

  get Expenses() {
    return this.expenses.asObservable();
  }

  get ExpensesToApprove() {
    return this.expensesToApprove.asObservable();
  }

  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  //getExpense(id: string) {
    //return this.http.get<IExpense>(`https://bookings-6c7de.firebaseio.com/offered-places/${id}.json`).pipe(
    //  map(expenseData => {
       // return new Expense(id, placeData.title, placeData.description, placeData.imageUrl, placeData.price,
       //   new Date(placeData.availableFrom), new Date(placeData.availableTo), placeData.userId);
    //  })
   // );
  // return this.expenses;
 // }

  addExpense(
    category: string,
    date: Date,
    amount: number,
    currency: string,
    employeeReimburse: boolean,
    description: string,
    reason: string,
    customerCharge: boolean,
    customer: string,
    project: string,
    document: object,
    userId: string,
    approverId: string) {

      let generatedId: string;
      let newId = Math.trunc(Math.random() * 30000);
      const expense = new Expense(newId, category, date, amount, currency, employeeReimburse, description, reason, customerCharge,
        customer, project, document, userId, approverId, 'New');
      return this.http.post<{name: string}>('https://expenses-81bae-default-rtdb.firebaseio.com/expenses-81bae-default-rtdb-export.json',
        { ...expense}).pipe(switchMap(
          resData => {
            generatedId = resData.name;
            return this.expenses;
        }),
        take(1),
        tap(expenses => {
          expense.id = newId;
          this.expenses.next(expenses.concat(expense));
      }));
      //return this.places.pipe(take(1),
      //  delay(1000),
      //  tap(places => {
      //    this.places.next(places.concat(place));
      //  })
      //);
  }

  fetchExpenses() {
    return this.http.get<{ [key: string]: IExpense}>('https://expenses-81bae-default-rtdb.firebaseio.com/expenses-81bae-default-rtdb-export.json').pipe(map(resData => {
      const expenses = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          if (resData[key].approverId !== 'willeneleroux@gmail.com') {
          expenses.push(new Expense(resData[key].id, resData[key].category, new Date(resData[key].date), resData[key].amount,
            resData[key].currency, resData[key].employeeReimburse, resData[key].description, resData[key].reason, 
            resData[key].customerCharge, resData[key].customer, resData[key].project, resData[key].document,
            resData[key].userId, resData[key].approverId, resData[key].status));
          }
        }
      }
      return expenses;
    }),
    tap(expenses => {
      this.expenses.next(expenses);
    })
    );
  }

  fetchExpensesToApprove() {
    return this.http.get<{ [key: string]: IExpense}>('https://expenses-81bae-default-rtdb.firebaseio.com/expenses-81bae-default-rtdb-export.json').pipe(map(resData => {
      const expenses = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          if (resData[key].approverId === 'willeneleroux@gmail.com') {
          expenses.push(new Expense(resData[key].id, resData[key].category, new Date(resData[key].date), resData[key].amount,
            resData[key].currency, resData[key].employeeReimburse, resData[key].description, resData[key].reason, 
            resData[key].customerCharge, resData[key].customer, resData[key].project, resData[key].document,
            resData[key].userId, resData[key].approverId, resData[key].status));
          }
        }
      }
      return expenses;
    }),
    tap(expenses => {
      this.expensesToApprove.next(expenses);
    })
    );
  }

  updateExpense(
    id: string,
    title: string,
    description: string) {

    let updatedExpenses = [];

    return this.expenses.pipe(
      take(1),
      switchMap(expenses => {
        if (!expenses || expenses.length <= 0) {
          return this.fetchExpenses();
        } else {
          return of(expenses);
        }
      }),
      switchMap(expenses => {
      const updatedExpenseIndex = expenses.findIndex(pl => pl.id === id);
      updatedExpenses = [...expenses];
      const oldPlace = updatedExpenses[updatedExpenseIndex];
      updatedExpenses[updatedExpenseIndex] = undefined;//new Expense(oldPlace.id, title, description, oldPlace.imageUrl,
        //oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId);

      return this.http.put(`https://bookings-6c7de.firebaseio.com/offered-places/${id}.json`,
        {...updatedExpenses[updatedExpenseIndex], id: null});
      }),
      tap(() => {
        this.expenses.next(updatedExpenses);
      })
      );
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public async getUserInfo(): Promise<void> {
    this.userInfo = await this.authService.getUserInfo<IUserInfo>();
  }

}
