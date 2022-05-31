import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";

export abstract class RaguService {
  
  protected readonly Uri: string;

  constructor(resource: string){
    this.Uri = `${environment.raguBaseUrl}/api/${resource}`;
  }

  protected handleError(httpBadResponse: HttpErrorResponse) : Observable<never> {
    httpBadResponse.status === 0 ?
    console.error('client side error', httpBadResponse.error) :
    console.error(`server side error: ${httpBadResponse.status}`, httpBadResponse.error);
    return throwError(() => new Error('something unexpected occurred!'));
  }
}