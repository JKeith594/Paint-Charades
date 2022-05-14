package net.jameskeith.paintcharades.player;

import net.jameskeith.paintcharades.game.GameService;
import net.jameskeith.paintcharades.game.objects.Game;
import net.jameskeith.paintcharades.login.objects.LoginRequest;
import net.jameskeith.paintcharades.login.objects.LoginResponse;
import net.jameskeith.paintcharades.player.objects.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {
    @Autowired
    GameService gameService;

    public Boolean setIcon(String roomCode, String desiredIcon, String sessionId) {
        boolean iconTaken = gameService.getGameFromRoomCode(roomCode).getAllPlayers().stream().anyMatch(player -> player.getIcon().equalsIgnoreCase(desiredIcon));

        if(iconTaken) { return false; }

        gameService.getGameFromRoomCode(roomCode).getPlayer(sessionId).setIcon(desiredIcon);
        gameService.notifyGameUpdate(roomCode);

        return true;
    }

    public Boolean kickPlayer(String roomCode, String playerToKick) {
        List<Player> playersToKick = gameService.getGameFromRoomCode(roomCode).getAllPlayers().stream().filter(player -> player.getName().equalsIgnoreCase(playerToKick)).collect(Collectors.toList());
        if(!playersToKick.isEmpty()) {
            gameService.getGameFromRoomCode(roomCode).removePlayer(playersToKick.get(0).getSessionId());
        } else {
            return false;
        }

        gameService.notifyGameUpdate(roomCode);

        return true;
    }

    public Player createNewPlayer(LoginRequest loginRequest,
                                   HttpSession session,
                                   LoginResponse loginResponse,
                                   Game currentGame,
                                   Boolean isAdmin) {
        Player player = new Player();
        player.setName(loginRequest.getUsername());
        player.setIsAdmin(isAdmin);
        player.setSessionId(session.getId());

        return player;
    }
}
