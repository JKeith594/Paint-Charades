package net.jameskeith.paintcharades.player;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
public class PlayerController {
    @Autowired
    PlayerService playerService;

    @RequestMapping(value="/player/icon", method= RequestMethod.POST)
    public Boolean updateIcon(@CookieValue(name = "roomCode") String roomCode, @CookieValue(name = "sessionId") String sessionId, @RequestBody String desiredIcon) {
        return playerService.setIcon(roomCode, desiredIcon, sessionId);
    }

    @RequestMapping(value="/player/{name}", method= RequestMethod.DELETE)
    public Boolean kickPlayer(@CookieValue(name = "roomCode") String roomCode, @CookieValue(name = "sessionId") String sessionId, @RequestParam("name") String playerToKick) {
        return playerService.kickPlayer(roomCode, playerToKick);
    }
}
