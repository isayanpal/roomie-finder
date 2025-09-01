import type { LucideIcon } from "lucide-react"


export interface User {
  id: string;
  name: string;
  image: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface MatchCardProps {
  userId: string
  userImage: string
  userName: string
  matchPercent: number
  location: string
  gender: string
  occupation: string
}

export interface Unread {
  senderId: string;
  count: number;
  senderName: string;
}

export interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
  gender: string;
  location: string;
  occupation: string;
  preferences: {
    cleanliness: string;
    nightOwl: string;
    smoker: string;
  };
}

export interface Preferences {
  cleanliness: string;
  nightOwl: string;
  smoker: string;
}

export interface FormData {
  location: string;
  gender: string;
  occupation: string;
  preferences: Preferences;
}