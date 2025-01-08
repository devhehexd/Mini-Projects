package com.example.my_open_market.user;

import com.example.my_open_market.authentication.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        UserDto userDtoForAdd = userService.saveUser(userDto);
        map.put("userDto", userDtoForAdd);
        return map;
    }

    @PostMapping("/login")
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

    @PutMapping("")
    public Map editUser(UserDto userDto) {
        Map map = new HashMap();
        UserDto prevUserDto = userService.getUserById(userDto.getId());
        prevUserDto.setPassword(userDto.getPassword());
        prevUserDto.setEmail(userDto.getEmail());
        prevUserDto.setType(userDto.getType());

        UserDto userDtoEdited = userService.saveUser(prevUserDto);
        map.put("userDto", userDtoEdited);
        return map;
    }

    @GetMapping("/{id}")
    public Map getUserById(@PathVariable("id") String id) {
        Map map = new HashMap();
        UserDto userDto = userService.getUserById(id);
        map.put("userDto", userDto);
        return map;
    }

    @DeleteMapping("/{id}")
    public Map deleteUser(@PathVariable("id") String id) {
        Map map = new HashMap();
        boolean isUserDeleted = true;

        try {
            userService.deleteUser(id);
        } catch (Exception e) {
            e.printStackTrace();
            isUserDeleted = false;
        }
        map.put("isUserDeleted", isUserDeleted);
        return map;
    }
}
