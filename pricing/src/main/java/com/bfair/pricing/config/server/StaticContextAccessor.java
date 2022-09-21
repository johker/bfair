package com.bfair.pricing.config.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;


@SuppressWarnings("restriction")
@Component
public class StaticContextAccessor {

    private static StaticContextAccessor instance;

    @Autowired
    private ApplicationContext applicationContext;

    @PostConstruct
    public void registerInstance() {
        instance = this;
    }

    public static <T> T getBean(Class<T> clazz) {
    	return instance.applicationContext.getBean(clazz);
    }

}