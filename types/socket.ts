export interface LocationData {
    userId: string;
    lat: number;
    lng: number;
    timestamp: number;
}

export interface ServerToClientEvents {
    locationUpdate: (locations: LocationData[]) => void;
}

export interface ClientToServerEvents {
    sendLocation: (location: LocationData) => void;
}
