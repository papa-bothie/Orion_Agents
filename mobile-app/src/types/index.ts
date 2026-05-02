export enum AgentStatus {
  DISPONIBLE = 'DISPONIBLE',
  EN_MISSION = 'EN_MISSION',
  HORS_LIGNE = 'HORS_LIGNE',
}

export enum AgentType {
  POLICE = 'POLICE',
  GENDARMERIE = 'GENDARMERIE',
  SAPEUR_POMPIER = 'SAPEUR_POMPIER',
  SAMU = 'SAMU',
  EAUX_ET_FORETS = 'EAUX_ET_FORETS',
  GMI = 'GMI',
  UCG = 'UCG',
  PROTECTION_CIVILE = 'PROTECTION_CIVILE',
  AUTRE = 'AUTRE',
}

export interface Agent {
  id: string;
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  statut: AgentStatus;
  type: AgentType;
  matricule?: string;
  grade?: string;
  service?: string;
  photoUrl?: string;
  dateCreation: string | Date;
}

export enum IncidentStatus {
  NOUVEAU = 'NOUVEAU',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
  FAUX_SIGNALEMENT = 'FAUX_SIGNALEMENT',
}

export interface Incident {
  id: string;
  reference?: string;
  type: string;
  urgency?: 'URGENT' | 'NON_URGENT';
  description: string;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  agentAssigneId?: string;
  dateCreation: string | Date;
}
