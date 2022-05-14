package net.jameskeith.paintcharades.game.objects;

import lombok.Data;
import lombok.NoArgsConstructor;
import net.jameskeith.paintcharades.player.objects.Player;

@Data
@NoArgsConstructor
public class PlayerWordGuessCounter {
    Player player;
    float secondsTakenToGuess;
}
