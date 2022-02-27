import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Gametype {
  FPS = "FPS",
  MMORPG = "MMORPG",
  SANDBOX = "SANDBOX",
  PVP = "PVP",
  PVE = "PVE",
  MOBA = "MOBA"
}

export enum Platform {
  PLAYSTATION = "PLAYSTATION",
  XBOX = "XBOX",
  PC = "PC"
}



type MatchMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Match {
  readonly id: string;
  readonly User1?: User;
  readonly User1ID: string;
  readonly User2ID?: string;
  readonly User2?: User;
  readonly isMatched: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly matchUser1Id?: string;
  readonly matchUser2Id?: string;
  constructor(init: ModelInit<Match, MatchMetaData>);
  static copyOf(source: Match, mutator: (draft: MutableModel<Match, MatchMetaData>) => MutableModel<Match, MatchMetaData> | void): Match;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly image?: string;
  readonly bio: string;
  readonly gameType: Gametype | keyof typeof Gametype;
  readonly platforms: Platform | keyof typeof Platform;
  readonly lookingGameType: Gametype | keyof typeof Gametype;
  readonly lookingPlatformType: Platform | keyof typeof Platform;
  readonly sub: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}