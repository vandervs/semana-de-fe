import type { Initiative } from './definitions';

export const mockInitiatives: Initiative[] = [
  {
    id: '1',
    locationName: 'São Paulo, SP',
    latitude: -23.55,
    longitude: -46.63,
    evangelized: [{ name: 'Maria' }],
    evangelists: [{ name: 'João' }],
    photoUrl: 'https://picsum.photos/seed/ev1/600/400',
    photoHint: 'pessoa sorrindo',
    testimony: 'Tivemos uma conversa maravilhosa sobre fé na Avenida Paulista. Maria estava muito aberta e oramos juntos. Foi um momento lindo.',
    interactionTypes: ['presentation'],
    date: '2024-07-20',
  },
  {
    id: '2',
    locationName: 'Rio de Janeiro, RJ',
    latitude: -22.91,
    longitude: -43.17,
    evangelized: [{ name: 'Carlos' }],
    evangelists: [{ name: 'Ana' }],
    photoUrl: 'https://picsum.photos/seed/ev2/600/400',
    photoHint: 'pôr do sol na praia',
    testimony: 'Compartilhei o evangelho com o Carlos perto da praia de Copacabana. Ele se emocionou com a mensagem e aceitou Jesus em sua vida! Glória a Deus!',
    interactionTypes: ['acceptance'],
    date: '2024-07-21',
  },
  {
    id: '3',
    locationName: 'Belo Horizonte, MG',
    latitude: -19.92,
    longitude: -43.93,
    evangelized: [{ name: 'Fernanda' }],
    evangelists: [{ name: 'Pedro' }],
    photoUrl: 'https://picsum.photos/seed/ev3/600/400',
    photoHint: 'parque da cidade',
    testimony: 'Acabei de ter uma conversa espiritual profunda com a Fernanda no Parque Municipal. Ela está pensando profundamente sobre o que discutimos.',
    interactionTypes: ['conversation'],
    date: '2024-07-19',
  },
    {
    id: '4',
    locationName: 'Vitória, ES',
    latitude: -20.32,
    longitude: -40.31,
    evangelized: [{ name: 'Lucas' }],
    evangelists: [{ name: 'Sofia' }],
    photoUrl: 'https://picsum.photos/seed/ev4/600/400',
    photoHint: 'vista para o mar',
    testimony: 'Apresentei o plano de salvação para o Lucas na Praia da Costa. Ele tem muitas perguntas e nos encontraremos novamente na próxima semana.',
    interactionTypes: ['presentation'],
    date: '2024-07-22',
  },
   {
    id: '5',
    locationName: 'Campinas, SP',
    latitude: -22.9071,
    longitude: -47.0633,
    evangelized: [{ name: 'Juliana' }],
    evangelists: [{ name: 'Marcos' }],
    photoUrl: 'https://picsum.photos/seed/ev5/600/400',
    photoHint: 'campus universitário',
    testimony: 'Juliana, uma estudante universitária, decidiu seguir a Cristo depois de conversarmos por uma hora. Agora estamos conectando-a a uma igreja local.',
    interactionTypes: ['acceptance', 'conversation'],
    date: '2024-07-23',
  }
];

export function addInitiative(initiative: Initiative) {
    mockInitiatives.unshift(initiative);
}
