package net.jameskeith.paintcharades.login;

import net.jameskeith.paintcharades.game.GameService;
import net.jameskeith.paintcharades.game.objects.Game;
import net.jameskeith.paintcharades.login.objects.LoginRequest;
import net.jameskeith.paintcharades.login.objects.LoginResponse;
import net.jameskeith.paintcharades.player.PlayerService;
import net.jameskeith.paintcharades.player.objects.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpSession;
import java.util.Random;

@Service
public class LoginService {
    @Autowired
    GameService gameService;

    @Autowired
    PlayerService playerService;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    public LoginService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public LoginResponse attemptLogin(@RequestBody LoginRequest loginRequest, HttpSession session) {
        LoginResponse loginResponse = new LoginResponse();
        if(loginRequest.getRoomCode() == null || loginRequest.getRoomCode().isEmpty()) {
            if(loginRequest.getUsername() == null || loginRequest.getUsername().isEmpty()) {
                loginResponse.setResponse("Error. Somehow you didn't specify a username.");
            }
            else {
                Game createdGame = gameService.createNewGame();
                Player newPlayer = playerService.createNewPlayer(loginRequest, session, loginResponse, createdGame, true);
                createdGame.addPlayer(session.getId(), newPlayer);
                createdGame.setCurrentState("LOBBY");

                setResponseOk(session, loginResponse, createdGame.getRoomCode());
                loginResponse.setGame(createdGame);

                gameService.setGameFromRoomCode(createdGame.getRoomCode(), createdGame);
            }
        } else {
            if(gameService.getGameFromRoomCode(loginRequest.getRoomCode()) == null) {
                loginResponse.setResponse("Error. Bad room code.");
            } else {
                Game currentGame = gameService.getGameFromRoomCode(loginRequest.getRoomCode());
                boolean nameExists = currentGame.getAllPlayers().stream().anyMatch(player -> player.getName().equalsIgnoreCase(loginRequest.getUsername()));
                if(!nameExists) {
                    addNewPlayerToGame(loginRequest, session, loginResponse, currentGame);
                } else {
                    if(currentGame.getPlayer(loginRequest.getSessionId()).getName().equals(loginRequest.getUsername())) {
                        addDisconnectedPlayerBackToGame(loginRequest, session, loginResponse, currentGame);
                    } else {
                        loginResponse.setResponse("Error. Username taken.");
                    }
                }
            }
        }
        return loginResponse;
    }

    private void addDisconnectedPlayerBackToGame(LoginRequest loginRequest, HttpSession session, LoginResponse loginResponse, Game currentGame) {
        Player existingPlayer = currentGame.getPlayer(loginRequest.getSessionId());
        currentGame.addPlayer(session.getId(), existingPlayer);
        currentGame.removePlayer(loginRequest.getSessionId());
        setResponseOk(session, loginResponse, loginRequest.getRoomCode());
        loginResponse.setGame(currentGame);
        gameService.notifyGameUpdate(loginRequest.getRoomCode());
    }

    private void addNewPlayerToGame(LoginRequest loginRequest, HttpSession session, LoginResponse loginResponse, Game currentGame) {
        setResponseOk(session, loginResponse, loginRequest.getRoomCode());
        Player playerToAdd = playerService.createNewPlayer(loginRequest, session, loginResponse, currentGame, false);
        currentGame.addPlayer(session.getId(), playerToAdd);
        loginResponse.setGame(currentGame);
        gameService.notifyGameUpdate(loginRequest.getRoomCode());
    }

    private void setResponseOk(HttpSession session, LoginResponse loginResponse, String roomCode) {
        loginResponse.setResponse("OK");
        loginResponse.setSessionId(session.getId());
        loginResponse.setRoomCode(roomCode);
    }




}
