package net.jameskeith.paintcharades.drawing;

import net.jameskeith.paintcharades.game.GameService;
import net.jameskeith.paintcharades.game.objects.Game;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
public class DrawingService {
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    GameService gameService;

    public DrawingService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void handleDrawing(String drawing, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        String sessionId = headerAccessor.getSessionAttributes().get("sessionId").toString();
        String roomCode = headerAccessor.getSessionAttributes().get("roomCode").toString();
        headerAccessor.setSessionId(sessionId);
        Game currentGame = gameService.getGameFromRoomCode(roomCode);
        messagingTemplate.convertAndSend("/topic/drawing/" + roomCode, drawing);
    }
}
