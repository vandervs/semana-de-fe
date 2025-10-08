
import { Share, HeartHandshake, MessageCircle, Star, Handshake, Users, ListPlus, HelpingHand, Gift } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Task = {
  id: string;
  category: string;
  description: string;
  icon: LucideIcon;
};

export const tasks: Task[] = [
  {
    id: 'testemunho-pessoal',
    category: 'Interação',
    description: 'Compartilhar seu testemunho pessoal com alguém.',
    icon: Share,
  },
  {
    id: 'ato-de-bondade-desconhecido',
    category: 'Serviço',
    description: 'Realizar um ato de bondade com um desconhecido.',
    icon: HeartHandshake,
  },
  {
    id: 'conversa-espiritual-amigo',
    category: 'Conversa',
    description: 'Iniciar uma conversa espiritual com um amigo.',
    icon: MessageCircle,
  },
  {
    id: 'orar-por-alguem',
    category: 'Oração',
    description: 'Parar e orar por alguém no local onde você está.',
    icon: Star,
  },
  {
    id: 'convidar-para-evento',
    category: 'Convite',
    description: 'Convidar alguém para um evento da Cru.',
    icon: Handshake,
  },
  {
    id: 'orar-por-missionario',
    category: 'Oração',
    description: 'Orar por um missionário da Cru que você conheça.',
    icon: Star,
  },
  {
    id: 'desafiar-comecar-cru',
    category: 'Convite',
    description: 'Desafiar alguém a começar um movimento da Cru em seu campus.',
    icon: Handshake,
  },
  {
    id: 'grupo-oracao-amigos',
    category: 'Interação',
    description: 'Encontrar com um grupo de amigos para orarem uns pelos outros.',
    icon: Users,
  },
  {
    id: 'lista-oracao-10',
    category: 'Oração',
    description: 'Fazer uma lista de 10+ pessoas e orar por ela durante toda a semana.',
    icon: ListPlus,
  },
  {
    id: 'conversa-espiritual-familiar',
    category: 'Conversa',
    description: 'Iniciar uma conversa espiritual com um familiar ou parente.',
    icon: MessageCircle,
  },
  {
    id: 'ato-de-bondade-amigo',
    category: 'Serviço',
    description: 'Realizar um ato de bondade com um amigo.',
    icon: HeartHandshake,
  },
  {
    id: 'ofertar-para-projeto',
    category: 'Convite',
    description: 'Ofertar na vida de alguém que está levantando sustento para um projeto da Cru.',
    icon: Gift,
  },
  {
    id: 'ajudar-movimento-local',
    category: 'Serviço',
    description: 'Pensar em como você pode ajudar o movimento no seu campus e fazer isso.',
    icon: HelpingHand,
  },
  {
    id: 'conversa-espiritual-conecta',
    category: 'Conversa',
    description: 'Iniciar uma conversa espiritual usando a ferramenta Conecta.',
    icon: MessageCircle,
  },
  {
    id: 'conversa-espiritual-perspectiva',
    category: 'Conversa',
    description: 'Iniciar uma conversa espiritual usando a ferramenta Perspectiva.',
    icon: MessageCircle,
  },
];
