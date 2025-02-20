import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_API') private baseAPI: string
  ) {
        this._baseApi = `${this.baseAPI}Request/`
  }

  private _baseApi: string

  public getTask(): Observable<QueueViewModel[]>{
    return this.http.get<QueueViewModel[]>(`${this._baseApi}GetTask`)
  }
}

export interface QueueViewModel {
  guid: string;
  firstName: string;
  lastName: string;
  pIDNo: string;
}