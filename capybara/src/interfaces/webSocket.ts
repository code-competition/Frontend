export interface WebSocketBase<T> {
  op: string;
  d: T;
}

export interface Hello {
  id: string;
}
