package net.jameskeith.paintcharades.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWSController {
    @Autowired
    ChatService chatService;

    @MessageMapping("/chat")
    public void processMessageFromClient(@Payload String message, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        this.chatService.processMessageFromClient(message, headerAccessor);
    }
}
