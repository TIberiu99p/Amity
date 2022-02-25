// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Gametype = {
  "FPS": "FPS",
  "MMORPG": "MMORPG",
  "SANDBOX": "SANDBOX",
  "PVP": "PVP",
  "PVE": "PVE",
  "MOBA": "MOBA"
};

const Platform = {
  "PLAYSTATION": "PLAYSTATION",
  "XBOX": "XBOX",
  "PC": "PC"
};

const { Match, User } = initSchema(schema);

export {
  Match,
  User,
  Gametype,
  Platform
};