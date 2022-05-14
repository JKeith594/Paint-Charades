package net.jameskeith.paintcharades.login.objects;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginRequest {
    String username;
    String roomCode;
    String sessionId;
}
