package net.jameskeith.paintcharades.config;


import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

public class HttpHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                                   Map attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletServerRequest = (ServletServerHttpRequest) request;
            HttpServletRequest servletRequest = servletServerRequest.getServletRequest();
            Cookie sessionId = WebUtils.getCookie(servletRequest, "sessionId");
            Cookie roomCode = WebUtils.getCookie(servletRequest, "roomCode");
            attributes.put("sessionId", sessionId.getValue());
            attributes.put("roomCode", roomCode.getValue());
        }
        return true;
    }

    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                               Exception ex) {
    }
}