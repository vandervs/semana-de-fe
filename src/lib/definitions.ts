export type Person = {
  name: string;
  contact?: string;
};

export type Initiative = {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  evangelized: Person[];
  evangelists: Person[];
  photoUrl: string;
  photoHint: string;
  testimony: string;
  interactionTypes: ('conversation' | 'presentation' | 'acceptance')[];
  date: string;
  createdAt?: any;
  evangelismTools: string[];
  university: string;
};
