package net.jameskeith.paintcharades.player.objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Player implements Comparable {
    String name = "";
    String icon = "";

    @JsonIgnore
    String sessionId = "";

    int score = 0;
    Boolean isAdmin = false;
    Boolean choosingWord = false;

    @Override
    public int compareTo(Object o) {
        if (o instanceof Player player) {
            if(this.getScore() > player.getScore()) {
                return -1;
            } else if (this.getScore() < player.getScore()) {
                return 1;
            }
        }
        return 0;
    }
}
