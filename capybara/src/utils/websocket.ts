class SocketConnection {
  url: string;
  ws: WebSocket;

  constructor(socketUrl: string) {
    this.url = socketUrl;
    this.ws = new WebSocket(socketUrl);
  }
}

export default SocketConnection;
