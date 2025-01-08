package com.example.my_open_market.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto saveUser(UserDto userDto) {

        User entity = userDao.save(new User(userDto.getId(), passwordEncoder.encode(userDto.getPassword()),
                userDto.getEmail(), userDto.getType()));

        return new UserDto(entity.getId(), entity.getPassword(),
                entity.getEmail(), entity.getType());
    }

    public UserDto getUserById(String id) {

        User entity = userDao.findById(id).orElse(null);
        if (entity != null) {
            return new UserDto(entity.getId(), entity.getPassword(),
                    entity.getEmail(), entity.getType());
        }
        return null;
    }

    public void deleteUser(String id) {
        userDao.deleteById(id);
    }
}
