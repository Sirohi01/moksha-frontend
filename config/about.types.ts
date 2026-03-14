// Type definitions for About Us page configuration

export interface AboutStatConfig {
  number: string;
  label: string;
}

export interface AboutValueConfig {
  icon: string;
  title: string;
  description: string;
}

export interface AboutTeamMemberConfig {
  name: string;
  role: string;
  city: string;
  years: string;
}

export interface AboutCertificationConfig {
  text: string;
}

export interface AboutHeroConfig {
  badge: string;
  title: string;
  description: string;
  stats: AboutStatConfig[];
  image: string;
  cardTitle: string;
  cardDescription: string;
}

export interface AboutMissionVisionConfig {
  mission: {
    title: string;
    description: string;
    icon: string;
  };
  vision: {
    title: string;
    description: string;
    icon: string;
  };
}

export interface AboutStoryConfig {
  tag: string;
  title: string;
  paragraphs: string[];
  stats: AboutStatConfig[];
  image: string;
  imageAlt: string;
}

export interface AboutValuesConfig {
  tag: string;
  title: string;
  values: AboutValueConfig[];
}

export interface AboutTeamConfig {
  tag: string;
  title: string;
  members: AboutTeamMemberConfig[];
}

export interface AboutCertificationsConfig {
  title: string;
  certifications: AboutCertificationConfig[];
}

export interface AboutPageConfig {
  hero: AboutHeroConfig;
  missionVision: AboutMissionVisionConfig;
  story: AboutStoryConfig;
  values: AboutValuesConfig;
  team: AboutTeamConfig;
  certifications: AboutCertificationsConfig;
  metadata: {
    title: string;
  };
}