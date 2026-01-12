// Type definitions for the game top-up platform

export interface Game {
  id: string;
  name: string;
  image: string;
  category: string;
  popularity: number; // Higher number = more popular
  description: string;
  discount?: string;
  requiresServer?: boolean;
  requiresUsername?: boolean;
  idFieldLabel?: string; // e.g., "Player ID", "UID", "Username"
}

export interface TopUpPackage {
  id: string;
  name: string;
  amount: string; // e.g., "100 Diamonds", "500 UC"
  price: number;
  bonus?: string; // e.g., "+10 Diamonds"
  popular?: boolean;
}

export interface PaymentDetails {
  game: Game;
  package: TopUpPackage;
  playerId?: string;
  server?: string;
  username?: string;
}
