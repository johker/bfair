/*
 * Copyright 2002-2010 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.bfair.pricing.config.server;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bfair.pricing.config.AbstractStockAppRabbitConfiguration;
import com.bfair.pricing.json.MessageConverterFactory;
import com.bfair.pricing.stocks.dto.Market;

/**
 * Configures RabbitTemplate for the server.
 * 
 * @author Mark Pollack
 * @author Mark Fisher
 */
@Configuration
public class RabbitServerConfiguration extends AbstractStockAppRabbitConfiguration  {

	/**
	 * The server's template will by default send to the topic exchange named
	 * {@link AbstractStockAppRabbitConfiguration#MARKET_DATA_EXCHANGE_NAME}.
	 */
	public void configureRabbitTemplate(RabbitTemplate rabbitTemplate) {
		// TODO: Figure out how to set exchange at node
		//rabbitTemplate.setExchange(MARKET_DATA_EXCHANGE_NAME);		
	}

	/**
	 * We don't need to define any binding for the stock request queue, since it's relying
	 * on the default (no-name) direct exchange to which every queue is implicitly bound.
	 */
	@Bean
	public Queue stockRequestQueue() {		
		return new Queue(STOCK_REQUEST_QUEUE_NAME);	
	}

	@Override
	@Bean
	public DefaultClassMapper typeMapper() {
		DefaultClassMapper typeMapper = new DefaultClassMapper();
		Map<String, Class<?>> idClassMapping = new HashMap<String, Class<?>>();
		idClassMapping.put("bookdto", Market.class);
		typeMapper.setIdClassMapping(idClassMapping);
		return typeMapper;
	}

	@Override
	@Bean
	public MessageConverter jsonMessageConverter() {
		return MessageConverterFactory.getInstance(typeMapper());
	}

}
