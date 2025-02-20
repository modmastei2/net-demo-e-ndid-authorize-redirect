import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, map, Subscription, takeWhile } from 'rxjs';
import { QueueViewModel } from '../../services/request.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SseService } from '../../services/sse.service';
import { SignalRService } from '../../services/signal-r.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, OnDestroy {
    public token: string;
    public state: 'initial' | 'select' | 'process' | 'done' = 'initial'
    public subscription: Subscription;
    public countdown = 120;
    public displayTime = '00:00:05'
    public taskList: QueueViewModel[] = [];

    public messages : {token : string, message: string}[] = [];
    public overrideToken: string = '';

    constructor(
        private activatedRoute: ActivatedRoute,
        private sse: SseService,
        private signalr: SignalRService
    ) {

    }

    public ngOnInit(): void {
        const { token } = this.activatedRoute.snapshot.queryParams
        this.displayTime = this.formatTime(this.countdown)

        if (!!token){
            this.token = token
        }

        if(!!this.token)
            this.onClickStart();

    }


    public onClickStart(): void {
        this.state = 'process'

        this.signalr.startConnection(this.token)
        this.signalr.listen((token, message) => {
            this.messages.push({token, message})
            
            // setTimeout(() => {
            //     window.location.href = 'https://127.0.0.1:45338/'
            // }, 1000);
        })

        this.startCountdown();
    }

    public onClickTrigger(overrideToken: string): void{
        this.signalr.sendMessage(!!overrideToken ? this.overrideToken : this.token, 'trigger')
    }

    public startCountdown(): void {
        this.subscription = interval(1000)
            .pipe(
                takeWhile(() => this.countdown > 0),
                map(() => this.countdown--)
            ).subscribe(() => {
                this.displayTime = this.formatTime(this.countdown);
            })
    }

    formatTime(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}`;
    }

    pad(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }

    ngOnDestroy() {
        if (this.subscription)
            this.subscription.unsubscribe();

        this.sse.disconnect()
    }
}
