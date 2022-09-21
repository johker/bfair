package com.bfair.pricing.json;

import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

public class MessageConverterFactory {

	public static MessageConverter getInstance(DefaultClassMapper typeMapper) {
		JsonMessageConverter jsonMessageConverter = new JsonMessageConverter();
		jsonMessageConverter.setClassMapper(typeMapper);
        return jsonMessageConverter;
	}

}
