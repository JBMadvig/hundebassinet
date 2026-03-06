import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface WsMessage {
    type: string;
    [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private socket: WebSocket | null = null;
    private messageSubject = new Subject<WsMessage>();
    private pendingMessages: object[] = [];

    public messages$ = this.messageSubject.asObservable();

    connect(): void {
        if (this.socket) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            for (const msg of this.pendingMessages) {
                this.socket!.send(JSON.stringify(msg));
            }
            this.pendingMessages = [];
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as WsMessage;
                this.messageSubject.next(data);
            } catch {
                // Ignore invalid JSON
            }
        };

        this.socket.onclose = () => {
            this.socket = null;
        };
    }

    send(payload: object): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(payload));
        } else if (this.socket) {
            this.pendingMessages.push(payload);
        }
    }

    subscribe(room: string): void {
        this.send({ type: 'subscribe', room });
    }

    unsubscribe(room: string): void {
        this.send({ type: 'unsubscribe', room });
    }

    disconnect(): void {
        this.socket?.close();
        this.socket = null;
    }
}
