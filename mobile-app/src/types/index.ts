export type Priority = 'normal' | 'high' | 'critical';
export type MissionStatus = 'EN_ATTENTE' | 'EN_COURS' | 'RÉSOLU' | 'ANNULÉ';

export interface GeoPoint {
    latitude: number;
    longitude: number;
}

export interface Mission {
    id: string;
    type: string;
    status: MissionStatus;
    priority: Priority;
    description?: string;
    locationName?: string;
    coordinates: GeoPoint;
    timestamp: string;
}
