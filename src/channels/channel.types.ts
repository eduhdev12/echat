export interface MessageCreate {
  content: string;
}

export interface EncryptedMessage {
  data: string;
  iv: Uint8Array;
}
