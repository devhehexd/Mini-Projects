package com.example.my_open_market.authentication;

import com.example.my_open_market.user.User;
import com.example.my_open_market.user.UserDao;
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
        User user = userDao.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("cannot find user " + username));
        return new UserDetailsImpl(user);
    }
}
