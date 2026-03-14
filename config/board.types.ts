// Type definitions for Board page configuration

export interface BoardMemberConfig {
  name: string;
  role: string;
  desc: string;
  icon: string;
  id: string;
}

export interface BoardStatConfig {
  number: string;
  label: string;
}

export interface BoardHeroConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface BoardJoinCardConfig {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export interface BoardPageConfig {
  hero: BoardHeroConfig;
  leadership: BoardMemberConfig[];
  joinCard: BoardJoinCardConfig;
  stats: BoardStatConfig[];
  labels: {
    viewProfile: string;
  };
  metadata: {
    title: string;
  };
}