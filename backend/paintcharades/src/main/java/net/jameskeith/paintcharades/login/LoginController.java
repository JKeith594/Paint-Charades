package net.jameskeith.paintcharades.login;

import net.jameskeith.paintcharades.login.objects.LoginRequest;
import net.jameskeith.paintcharades.login.objects.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @RequestMapping(value="/login", method=RequestMethod.POST)
    public LoginResponse login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        return loginService.attemptLogin(loginRequest, session);
    }


}
