package com.example.mini_todo_list.user;

import com.example.mini_todo_list.authentication.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private AuthenticationManagerBuilder authMngBuilder;

    @PostMapping("/createaccount")
    public Map createAccount(UserDto userDto) {
        Map map = new HashMap();
        UserDto userDtoForCreateAccount = userService.saveUser(userDto);
        map.put("newUser", userDtoForCreateAccount);
        return map;
    }

    @PostMapping("/")
    public Map login(String id, String password) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(id, password);
        Authentication authentication = authMngBuilder.getObject().authenticate(authToken);
        boolean isAuthenticated = authentication.isAuthenticated();

        Map map = new HashMap();
        if (isAuthenticated) {
            String token = tokenProvider.generateToken(userService.getUserById(id));
            map.put("token", token);
        }
        map.put("isAuthenticated", isAuthenticated);

        return map;
    }
}
