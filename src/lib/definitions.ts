export type Initiative = {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  evangelizedName: string;
  evangelistName: string;
  photoUrl: string;
  photoHint: string;
  testimony: string;
  interactionType: 'conversation' | 'presentation' | 'acceptance';
  date: string;
};
