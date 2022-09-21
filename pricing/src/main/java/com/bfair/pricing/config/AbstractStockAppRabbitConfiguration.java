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

package com.bfair.pricing.config;


import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Provides shared configuration between Client and Server.  
 * <p>The abstract method configureRabbitTemplate lets the Client and Server further customize
 * the rabbit template to their specific needs.
 * 
 * @author Mark Pollack
 * @author Mark Fisher
 */
@Configuration
public abstract class AbstractStockAppRabbitConfiguration {

	/**
	 * Shared topic exchange used for publishing any market data (e.g. stock quotes) 
	 */
	protected static String MARKET_DATA_EXCHANGE_NAME = "app.stock.marketdata";

	/**
	 * The server-side consumer's queue that provides point-to-point semantics for stock requests.
	 */
	protected static String STOCK_REQUEST_QUEUE_NAME = "com.bfair.pricing.market"; 

	/**
	 * Key that clients will use to send to the market information queue via the default direct exchange.
	 */
	protected static String STOCK_REQUEST_ROUTING_KEY = STOCK_REQUEST_QUEUE_NAME;
	
	
	@Value("${amqp.port:5672}") 
	private int port = 5672;
	

	protected abstract void configureRabbitTemplate(RabbitTemplate template);

	@Bean
	public ConnectionFactory connectionFactory() {
		
		CachingConnectionFactory connectionFactory = new CachingConnectionFactory("localhost");
		connectionFactory.setUsername("guest");
		connectionFactory.setPassword("guest");
		connectionFactory.setPort(port);
		return connectionFactory;
	}

	@Bean 
	public RabbitTemplate rabbitTemplate() {
		RabbitTemplate template = new RabbitTemplate(connectionFactory());
		template.setMessageConverter(jsonMessageConverter());
		configureRabbitTemplate(template);
		return template;
	}
	
	@Bean
	public abstract DefaultClassMapper typeMapper();	

	@Bean
	public abstract MessageConverter jsonMessageConverter();
	
	

	/**
	 * @return the admin bean that can declare queues etc.
	 */
	@Bean
	public AmqpAdmin amqpAdmin() {
		RabbitAdmin rabbitAdmin = new RabbitAdmin(connectionFactory());
		return rabbitAdmin ;
	}

}
