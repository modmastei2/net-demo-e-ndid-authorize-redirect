import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection!: signalR.HubConnection

    constructor() { }

    public startConnection(token: string): void{
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:7265/chatHub?token=${token}`, {
            withCredentials: false
        })
        .withAutomaticReconnect()
        .build();

        this.hubConnection.start()
        .then(() => console.log(`%c SignalR Start for ${token}!`, 'background: #222; color: #bada55'))
        .catch(err => console.error('Error starting SignalR: ', err));
    }

    public listen(callback: (token: string, message: string) => void){
        this.hubConnection.on('ReceiveMessage', callback)
    }

    public sendMessage(token: string, message: string) {
        this.hubConnection.invoke('SendMessageToUser', token, message)
        .catch(err => console.error(err))
    }
}
