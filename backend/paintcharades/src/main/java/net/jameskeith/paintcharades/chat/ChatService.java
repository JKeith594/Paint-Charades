package net.jameskeith.paintcharades.chat;

import net.jameskeith.paintcharades.chat.objects.ChatMessage;
import net.jameskeith.paintcharades.game.GameService;
import net.jameskeith.paintcharades.game.objects.Game;
import net.jameskeith.paintcharades.player.objects.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    GameService gameService;

    public ChatService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void processMessageFromClient(String message, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        try {
            String sessionId = headerAccessor.getSessionAttributes().get("sessionId").toString();
            String roomCode = headerAccessor.getSessionAttributes().get("roomCode").toString();
            headerAccessor.setSessionId(sessionId);

            Game currentGame = gameService.getGameFromRoomCode(roomCode);
            Player player = currentGame.getPlayer(sessionId);

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setUsername(player.getName());
            chatMessage.setIcon(player.getIcon().equals("") ? "loading" : player.getIcon());
            chatMessage.setMessage(message);

            boolean sentMessage = false;
            sentMessage = currentGame.handleMessageDuringPlay(message, player);
            if(!sentMessage) {
                messagingTemplate.convertAndSend("/topic/chat/" + roomCode, chatMessage);
            }

        } catch (Exception e) {
            System.out.println("Failed to process message from chat controller");
        }
    }
}
