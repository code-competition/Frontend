type Protocols = string | string[] | undefined;
type WebSocketData = string | ArrayBuffer | Blob | ArrayBufferView;

enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export enum WebSocketEvents {
  Close = "close",
  Error = "error",
  Message = "message",
  Open = "open",
  Retry = "retry",
}

interface RetryEvent {
  retries: number;
  maxRetries: number;
  initialDelay: number;
  delay: number;
}

interface WebSocketEventMap {
  close: CloseEvent;
  error: Event;
  message: MessageEvent<any>;
  open: Event;
  retry: RetryEvent;
}

export type EventListener<K extends WebSocketEvents> = (
  instance: ImprovedWebSocket,
  ev: WebSocketEventMap[K]
) => any;

interface StoredEventListener<K extends WebSocketEvents> {
  id: string;
  listener: (instance: ImprovedWebSocket, ev: WebSocketEventMap[K]) => any;
}

interface WebSocketEventListeners {
  open: StoredEventListener<WebSocketEvents.Open>[];
  close: StoredEventListener<WebSocketEvents.Close>[];
  error: StoredEventListener<WebSocketEvents.Error>[];
  message: StoredEventListener<WebSocketEvents.Message>[];
  retry: StoredEventListener<WebSocketEvents.Retry>[];
}

interface Backoff {
  initialDelay?: number;
  maxRetries?: number;
}

class ImprovedWebSocket {
  private url: string;
  private protocols: Protocols;
  private backoff: Backoff | undefined;
  private retries: number | undefined;
  private delay: number | undefined;
  private maxRetries: number | undefined;
  private initialDelay: number | undefined;
  private eventListeners: WebSocketEventListeners = {
    open: [],
    close: [],
    error: [],
    message: [],
    retry: [],
  };
  private ws?: WebSocket;
  private running = false;

  constructor(url: string, protocols?: Protocols, backoff?: Backoff) {
    this.url = url;
    this.protocols = protocols;
    this.backoff = backoff;

    if (backoff !== undefined) {
      this.retries = 0;
      this.delay =
        backoff.initialDelay === undefined ? 100 : backoff.initialDelay;
      this.initialDelay = this.delay;
      this.maxRetries =
        backoff.maxRetries === undefined ? 8 : backoff.maxRetries;
    }
  }

  public run(): this {
    if (!this.running) {
      this.running = true;
      this.tryConnect();
    }

    return this;
  }

  public bufferedAmount(): number | undefined {
    if (this.ws) return this.ws.bufferedAmount;
    return undefined;
  }

  public readyState(): ReadyState | undefined {
    if (this.ws) return this.ws.readyState;
    return undefined;
  }

  public send(data: WebSocketData): void {
    if (this.ws) this.ws.send(data);
  }

  public close(code?: number, reason?: string): void {
    if (this.ws) this.ws.close(code, reason);
  }

  public addEventListener<K extends WebSocketEvents>(
    type: K,
    id: string,
    listener: EventListener<K>
  ): this {
    (this.eventListeners[type] as StoredEventListener<K>[]).push({
      id,
      listener,
    });
    return this;
  }

  public removeEventListener<K extends WebSocketEvents>(
    type: K,
    id?: string,
    listener?: EventListener<K>
  ): this {
    if (id !== undefined) {
      (this.eventListeners[type] as StoredEventListener<K>[]) = (
        this.eventListeners[type] as StoredEventListener<K>[]
      ).filter((evl: StoredEventListener<K>) => {
        return evl.listener !== listener;
      });
    } else {
      (this.eventListeners[type] as StoredEventListener<K>[]) = (
        this.eventListeners[type] as StoredEventListener<K>[]
      ).filter((evl: StoredEventListener<K>) => {
        return evl.id !== id;
      });
    }

    return this;
  }

  public getEventListeners<K extends WebSocketEvents>(type: K): string[] {
    return (this.eventListeners[type] as StoredEventListener<K>[]).map(
      (evl: StoredEventListener<K>) => (evl as StoredEventListener<K>).id
    );
  }

  private tryConnect(): void {
    if (this.ws) {
      this.ws.removeEventListener("open", this.onOpen);
      this.ws.removeEventListener("close", this.onClose);
      this.ws.removeEventListener("message", this.onMessage);
      this.ws.removeEventListener("error", this.onError);
    }

    this.ws = new WebSocket(this.url, this.protocols);
    this.ws.addEventListener("open", this.onOpen);
    this.ws.addEventListener("close", this.onClose);
    this.ws.addEventListener("message", this.onMessage);
    this.ws.addEventListener("error", this.onError);
  }

  private onOpen = (ev: WebSocketEventMap["open"]) =>
    this.handleEvent(WebSocketEvents.Open, ev);

  private onClose = (ev: WebSocketEventMap["close"]) =>
    this.handleEvent(WebSocketEvents.Close, ev);

  private onMessage = (ev: WebSocketEventMap["message"]) =>
    this.handleEvent(WebSocketEvents.Message, ev);

  private onError = (ev: WebSocketEventMap["error"]) =>
    this.handleEvent(WebSocketEvents.Error, ev);

  private onRetry = (ev: WebSocketEventMap["retry"]) =>
    this.handleEvent(WebSocketEvents.Retry, ev);

  private handleEvent<K extends WebSocketEvents>(
    type: K,
    ev: WebSocketEventMap[K]
  ) {
    if (
      (type === WebSocketEvents.Close && (ev as CloseEvent).code === 1006) ||
      !(ev as CloseEvent).wasClean ||
      (ev as CloseEvent).reason === ""
    ) {
      this.reconnect();
    }

    if (type === WebSocketEvents.Open) {
      this.retries = 0;
      this.delay = this.initialDelay;
    }

    this.dispatchEvent<K>(type, ev);
  }

  private dispatchEvent<K extends WebSocketEvents>(
    type: K,
    ev: WebSocketEventMap[K]
  ) {
    (this.eventListeners[type] as StoredEventListener<K>[]).forEach(
      (evl: StoredEventListener<K>) => {
        evl.listener(this, ev);
      }
    );
  }

  private reconnect() {
    if (this.backoff === undefined || this.retries === this.maxRetries) return;

    setTimeout(() => {
      if (this.retries && this.maxRetries && this.delay && this.initialDelay) {
        this.dispatchEvent(WebSocketEvents.Retry, {
          retries: this.retries,
          maxRetries: this.maxRetries,
          delay: this.delay,
          initialDelay: this.initialDelay,
        });

        this.retries += 1;
        this.delay *= 2;

        this.tryConnect();
      }
    }, this.delay);
  }
}

export default ImprovedWebSocket;
