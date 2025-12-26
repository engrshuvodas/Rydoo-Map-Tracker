
export interface Rider {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  distanceFromLeader: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export enum ViewMode {
  PROTOTYPE = 'PROTOTYPE',
  DOCUMENTATION = 'DOCUMENTATION'
}

export enum DocSection {
  FIREBASE_SCHEMA = 'FIREBASE_SCHEMA',
  ANDROID_KOTLIN = 'ANDROID_KOTLIN',
  IOS_SWIFT = 'IOS_SWIFT',
  MAP_API_SPEC = 'MAP_API_SPEC',
  BACKGROUND_LOGIC = 'BACKGROUND_LOGIC'
}
