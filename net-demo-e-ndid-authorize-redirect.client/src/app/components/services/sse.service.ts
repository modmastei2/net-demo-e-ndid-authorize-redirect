import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SseService {

    private eventSource?: EventSource;
    private eventSubject = new Subject<any>();

    constructor(
        @Inject('BASE_API') private baseAPI: string
    ) {
        this._baseApi = `${this.baseAPI}Request/`
    }

    private _baseApi: string

    public connect(path: string): Observable<any> {
        if (!this.eventSource)
            this.eventSource = new EventSource(`${this._baseApi}${path}`)

        this.eventSource.onmessage = (event) => {
            this.eventSubject.next(event.data)
        }

        this.eventSource.onerror = (error) => {
            console.error("SEE Error: ", error)
            this.eventSource?.close();
            this.eventSubject.error(error);
        }

        return this.eventSubject.asObservable();
    }

    public disconnect(): void {
        this.eventSource?.close();
        this.eventSource = undefined;
    }
}
