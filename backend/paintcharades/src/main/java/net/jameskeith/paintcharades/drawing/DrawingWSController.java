package net.jameskeith.paintcharades.drawing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class DrawingWSController {
    @Autowired
    DrawingService drawingService;

    @MessageMapping("/drawing")
    public void processDrawingMessageFromClient(@Payload String drawing, SimpMessageHeaderAccessor headerAccessor) throws Exception {
        drawingService.handleDrawing(drawing, headerAccessor);
    }
}
