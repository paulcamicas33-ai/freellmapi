import type { Episode, EpisodeSound } from "../engine/types";
import ep01Sound from "../sound/ep01.json";
import ep02Sound from "../sound/ep02.json";
import ep03Sound from "../sound/ep03.json";
import ep04Sound from "../sound/ep04.json";
import ep05Sound from "../sound/ep05.json";
import ep06Sound from "../sound/ep06.json";
import ep07Sound from "../sound/ep07.json";
import ep08Sound from "../sound/ep08.json";
import ep09Sound from "../sound/ep09.json";
import ep10Sound from "../sound/ep10.json";

import { ep01 } from "./ep01";
import { ep02 } from "./ep02";
import { ep03 } from "./ep03";
import { ep04 } from "./ep04";
import { ep05 } from "./ep05";
import { ep06 } from "./ep06";
import { ep07 } from "./ep07";
import { ep08 } from "./ep08";
import { ep09 } from "./ep09";
import { ep10 } from "./ep10";

export const EPISODES: Record<string, Episode> = {
  ep01: { ...ep01, sound: ep01Sound as EpisodeSound },
  ep02: { ...ep02, sound: ep02Sound as EpisodeSound },
  ep03: { ...ep03, sound: ep03Sound as EpisodeSound },
  ep04: { ...ep04, sound: ep04Sound as EpisodeSound },
  ep05: { ...ep05, sound: ep05Sound as EpisodeSound },
  ep06: { ...ep06, sound: ep06Sound as EpisodeSound },
  ep07: { ...ep07, sound: ep07Sound as EpisodeSound },
  ep08: { ...ep08, sound: ep08Sound as EpisodeSound },
  ep09: { ...ep09, sound: ep09Sound as EpisodeSound },
  ep10: { ...ep10, sound: ep10Sound as EpisodeSound },
};
