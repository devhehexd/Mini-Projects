package com.example.mini_todo_list.authentication;

import com.example.mini_todo_list.user.User;
import com.example.mini_todo_list.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.findById(username).orElseThrow(()
                -> new UsernameNotFoundException("cannnot find user: " + username));

        return new UserDetailsImpl(user);
    }
}
