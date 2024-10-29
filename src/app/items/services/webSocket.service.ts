// websocket.service.ts
import { Injectable } from '@angular/core';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { RxStompConfig } from '@stomp/rx-stomp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const rxStompConfig: RxStompConfig = {
  // URL del WebSocket
  brokerURL: 'ws://localhost:9091/ws',

  // Headers opcionales para la conexión
  /*connectHeaders: {
    login: 'guest',
    passcode: 'guest'
  },
  */
  // Configuración de heartbeat
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,

  // Reintentos de reconexión
  reconnectDelay: 500,

  // Debug (desactivar en producción)
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  }
};

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private rxStomp: RxStomp;

  constructor() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure(rxStompConfig);
    this.rxStomp.activate();
  }

  // Método para suscribirse a un topic
  public subscribe<T>(topic: string): Observable<T> {
    return this.rxStomp.watch(topic).pipe(
      map(message => JSON.parse(message.body) as T)
    );
  }

  // Método para enviar mensajes
  public publish(destination: string, body: any): void {
    this.rxStomp.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  // Método para verificar el estado de la conexión
  public connected(): Observable<RxStompState> {
    return this.rxStomp.connected$;
  }

  // Método para desconectarse
  public disconnect(): void {
    this.rxStomp.deactivate();
  }
}
