package net.jameskeith.paintcharades.login.objects;

import lombok.Data;
import lombok.NoArgsConstructor;
import net.jameskeith.paintcharades.game.objects.Game;

@Data
@NoArgsConstructor
public class LoginResponse {
    String response;
    String sessionId;
    String roomCode;
    Game game;
}
