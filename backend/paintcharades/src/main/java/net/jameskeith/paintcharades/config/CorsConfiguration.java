package net.jameskeith.paintcharades.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebMvc
@SpringBootConfiguration
public class CorsConfiguration implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins}")
    String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .exposedHeaders("X-Auth-Token", "Authorization")
                .allowedMethods("POST", "GET", "DELETE", "PUT", "OPTIONS")
                .allowedHeaders("Accept", "Content-Type", "Origin",
                        "Authorization", "X-Auth-Token")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
