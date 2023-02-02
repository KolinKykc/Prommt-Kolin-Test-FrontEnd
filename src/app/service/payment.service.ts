import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Payment } from '../interface/payment';
import { PaymentRequest } from '../interface/paymentRequest';
import { Status } from '../enum/status.enum';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly apiUrl = 'http://localhost:8080/payments';

  constructor(private http: HttpClient) { }

//get all payments
payments$ = <Observable<Payment[]>>
this.http.get<Payment>(`${this.apiUrl}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError),
  );

//create one payment
create$ = (payment: PaymentRequest) => <Observable<Payment[]>>
this.http.post<PaymentRequest>(`${this.apiUrl}`, payment)
  .pipe(
    tap(console.log),
    catchError(this.handleError),
  );


//update one payment
update$ = (payment: Payment, paymentId: number) => <Observable<Payment[]>>
this.http.post<Payment>(`${this.apiUrl}/${payment.id}`,payment)
  .pipe(
    tap(console.log),
    catchError(this.handleError),
  );



//delete one payment
delete$ = (payment: Payment, paymentId: number) => <Observable<Payment[]>>
this.http.delete<Payment>(`${this.apiUrl}/${payment.id}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError),
  );


//handle error
private handleError(error: HttpErrorResponse): Observable<never> {
console.log(error);
return throwError('An error occured: ' + error.message + '\n Error Code:' + error.status);
}


}
