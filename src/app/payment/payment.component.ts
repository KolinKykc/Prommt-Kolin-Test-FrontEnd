import { Payment } from './../interface/payment';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {PaymentService} from "../service/payment.service"
import { catchError, map, startWith } from 'rxjs/operators';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { Status } from '../enum/status.enum';
import { ActivatedRoute } from '@angular/router';
import { PaymentRequest } from '../interface/paymentRequest';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit{

  data$: Observable<Payment[]>;
  private dataSubject = new BehaviorSubject<Payment[]>(null);
  readonly Status = Status;
  payments: Payment[]
  payment;
  updPayment : Payment;
  paymentForm: FormGroup;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private paymentService : PaymentService, private route :ActivatedRoute){}


  ngOnInit(): void {


    this.paymentService.payments$.subscribe(
      res => this.payments = res);
      console.log("payments:",this.payments)

      this.data$=  this.paymentService.payments$
      .pipe(
        map(result =>{
          this.dataSubject.next(result);
          return{...result}
        })
      );
      console.log("data:",this.data$)


    this.route.paramMap.subscribe( paramMap =>{
      this.payment = paramMap["params"]
      console.log("paym",this.payment);

      this.paymentForm = new FormGroup({
          formPaymentId: new FormControl(
              { value: this.payment.id, disabled: false },
              [Validators.required]
            ),
            formPaymentEmail: new FormControl(
              { value: this.payment.payer_email, disabled: false },
              [Validators.required]
            ),
            formPaymentCurrency: new FormControl(
              { value: this.payment.currency, disabled: false },
              [Validators.required]
            ),
            formPaymentAmount: new FormControl(
              { value: this.payment.amount, disabled: false },
              [Validators.required]
            ),
        });
})



  }



  createPayment(pymForm: NgForm ): void {


    this.paymentService.create$(pymForm.value as PaymentRequest).subscribe()
    this.paymentForm.reset();
    document.getElementById("closeModal").click();


      // this.data$ = this.paymentService.create$(pymForm.value as PaymentRequest)
      // .pipe(
      //   map(result =>{
      //     this.dataSubject.next(result);
      //     this.paymentForm.reset();
      //     document.getElementById("closeModal").click();
      //     return{...result}
      //   })
      // );
      // console.log("data:",this.data$)


}


updatePayment(payment:Payment): void {


     this.paymentService.update$(payment, this.payment.id ).subscribe()
    // .subscribe(data =>this.payment = data);

    this.data$=  this.paymentService.payments$
    .pipe(
      map(result =>{
        this.dataSubject.next(result);
        return{...result}
      })
    );
    console.log("data:",this.data$)

}


deletePayment(payment: Payment): void {

  console.log("deleting:", payment, "with id:", payment.id)

    this.data$=  this.paymentService.delete$(payment, this.payment.id)
    .pipe(
      map(result =>{
        this.dataSubject.next(result);
        return{...result}
      })
    );
    console.log("data:",this.data$)
    }


}


/*

<div class="container-xl">
  <div class="table-responsive">
      <div class="table-wrapper">
          <div class="table-title">
              <div class="row">
                  <div class="col-sm-6">
                      <h2>Manage Payments</h2>
                  </div>
                  <div class="col-sm-6">
                      <!--button (click)="addPayment()" type="button" class="btn btn-primary">Add Payment</button>-->

                      <a href="#addEmployeeModal" class="btn btn-success" data-toggle="modal">
                          <i class="material-icons">&#xE147;</i>
                          <span>New Payment</span>
                      </a>

                      <!--span>
                          <select (ngModelChange)="filterServers($event)" name="status" ngModel="ALL"
                              class="btn btn-info" style="height: 32.91px;">
                              <option value="ALL">ALL</option>
                              <option value="SERVER_UP">SERVER UP</option>
                              <option value="SERVER_DOWN">SERVER DOWN</option>
                          </select>
                      </span>-->
                  </div>
              </div>
          </div> <br>
          <ng-container *ngIf="(data$ | async) as appState" [ngSwitch]="appState.value">
              <ng-container *ngSwitchCase="DataState.LOADING_STATE">
                  <div class="col-md-12 single-note-item text-center">
                      <div class="spinner-border text-info" role="status"></div>
                  </div>
              </ng-container>
              <ng-container *ngSwitchCase="DataState.LOADED_STATE">
                  <table class="table table-striped table-hover" id="servers">
                      <thead>
                          <tr>
                            <th>Creatde Date</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Currency</th>
                            <th>Amount</th>
                            <th>Updated Date</th>
                            <th>Delete</th>
                          </tr>
                      </thead>
                      <tbody *ngFor="let payment of payments let i = index" >
                          <tr>
                              <td>{{ payment.created_date }}</td>
                              <td>{{ payment.payer_email }}</td>
                              <td>{{ payment.status }}</td>
                              <td>{{ payment.currency }}</td>
                              <td>{{ payment.amount }}</td>
                              <td>{{ payment.paid_date }}</td>

                              <!--td>
                                  <a (click)="updatePayment(paymentForm)" style="cursor: pointer;">
                                      <i *ngIf="(filterStatus$ | async) === '' || (filterStatus$ | async) !== payment.id"
                                          class="material-icons" title="Update Payment">&#xe328;</i>
                                      <i *ngIf="(filterStatus$ | async) === payment.id"
                                          class="fa fa-spinner fa-spin" style="font-size:24px"></i>
                                  </a>
                              </td>-->
                              <td>
                                  <a (click)="deletePayment(payment)" class="delete" data-toggle="modal"
                                      style="cursor: pointer;"><i class="material-icons" data-toggle="tooltip"
                                          title="Delete">&#xE872;</i></a>
                              </td>
                      </tbody>
                  </table>
              </ng-container>
              <ng-container *ngSwitchCase="DataState.ERROR_STATE">
                  <div class="alert-danger">
                      {{ appState.error }}
                  </div>
              </ng-container>
          </ng-container>
      </div>
  </div>
</div>

<!-- Add server Modal HTML -->
<div id="addEmployeeModal" class="modal fade">
  <div class="modal-dialog">
      <div class="modal-content">
          <form #paymentForm="ngForm" (ngSubmit)="createPayment(paymentForm)">
              <div class="modal-header">
                  <h4 class="modal-title">Add Payment</h4>
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div class="modal-body">
                  <div class="form-group">
                      <label>Email</label>
                      <input type="text" ngModel name="payer_email" class="form-control" required>
                  </div>
                  <div class="form-group">
                      <label>Currency</label>
                      <input type="text" ngModel name="currency" class="form-control" required>
                  </div>
                  <div class="row">
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
                          <div class="form-group">
                              <label>Amount</label>
                              <input type="text" ngModel name="amount" class="form-control" required>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-warning" id="closeModal" data-dismiss="modal">
                      Cancel
                  </button>
                  <button type="submit" [disabled]="paymentForm.invalid || (isLoading$ | async)"
                      class="btn btn-success">
                      <i *ngIf="isLoading$ | async" class="fas fa-spinner fa-spin"></i>
                      <span *ngIf="isLoading$ | async">Saving...</span>
                      <span *ngIf="!(isLoading$ | async)">Add</span>
                  </button>
              </div>
          </form>
      </div>
  </div>
</div>


this.data$ = this.paymentService.payments$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        //this.payments = response;
        console.log("response", response)
        return {payments : response}
      })
    );
*/
