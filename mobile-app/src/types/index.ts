export type Priority = 'normal' | 'high' | 'critical';
export type MissionStatus = 'pending' | 'accepted' | 'resolved';

export interface GeoPoint {
    latitude: number;
    longitude: number;
}

export interface Mission {
    id: string;
    type: string;
    status: MissionStatus;
    priority: Priority;
    locationName: string;
    coordinates: GeoPoint;
    timestamp: string;
}
