package net.jameskeith.paintcharades.game;

import net.jameskeith.paintcharades.game.objects.Game;
import net.jameskeith.paintcharades.game.objects.WordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class GameController {
    @Autowired
    GameService gameService;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @RequestMapping(value="/game/word/{firstRequest}", method= RequestMethod.GET)
    public List<WordRequest> getWords(@PathVariable("firstRequest") Boolean firstRequest, @CookieValue(name = "roomCode") String roomCode, @CookieValue(name = "sessionId") String sessionId) {
        // TODO: Validate that user is valid, etc.
        return gameService.getWordsToChooseFrom(firstRequest, roomCode);
    }

    @RequestMapping(value="/game/word", method= RequestMethod.POST)
    public Boolean pickWord(@CookieValue(name = "roomCode") String roomCode, @CookieValue(name = "sessionId") String sessionId, @RequestBody WordRequest chosenWord) {
        return gameService.pickWordToPlay(roomCode, chosenWord);
    }

    @RequestMapping(value="/game/state", method= RequestMethod.POST)
    public Boolean setGameStatus(@CookieValue(name = "roomCode") String roomCode, @CookieValue(name = "sessionId") String sessionId, @RequestBody String state) {
        return gameService.setGameState(roomCode, state);
    }

    @RequestMapping(value="/game/end", method= RequestMethod.GET)
    public Boolean endGame(@CookieValue(name = "roomCode") String roomCode, @CookieValue(name = "sessionId") String sessionId) {
        return gameService.endGame(roomCode);
    }
}
