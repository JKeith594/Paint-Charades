import { environment } from "src/environments/environment";

export class PlayerEndpoints {
    static PLAYER_ROOT_URL = environment.apiRootUrl + "player/";
    static PLAYER_ICON_URL = PlayerEndpoints.PLAYER_ROOT_URL + "icon";
}

export class GameEndpoints {
    static GAME_ROOT_URL = environment.apiRootUrl + "game/";
    static GAME_PICK_WORD_URL = GameEndpoints.GAME_ROOT_URL + "word/";
    static GAME_STATE_URL = GameEndpoints.GAME_ROOT_URL + "state";
}

export class LoginEndpoints {
    static LOGIN_ROOT_URL = environment.apiRootUrl + "login";
}

export class WebsocketEndpoints {
    static WS_ROOT_URL = environment.apiRootUrl + "ws";
}