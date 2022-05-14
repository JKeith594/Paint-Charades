package net.jameskeith.paintcharades.chat.objects;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatMessage {
    String username;
    String icon;
    String message;
}
