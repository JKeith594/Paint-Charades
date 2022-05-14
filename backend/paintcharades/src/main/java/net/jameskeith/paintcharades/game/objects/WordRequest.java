package net.jameskeith.paintcharades.game.objects;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WordRequest {
    String difficulty;
    String word;
    int points;

    @Override
    public String toString() {
        return this.word;
    }
}
