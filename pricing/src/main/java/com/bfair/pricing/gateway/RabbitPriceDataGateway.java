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

package com.bfair.pricing.gateway;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.log4j.Logger;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.support.RabbitGatewaySupport;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.beans.factory.annotation.Autowired;

import com.bfair.pricing.config.server.StaticContextAccessor;
import com.bfair.pricing.json.MessageConverterFactory;
import com.bfair.pricing.service.MarketDataService;
import com.bfair.pricing.service.PriceDataService;
import com.bfair.pricing.stocks.dto.Price;
import com.bfair.pricing.utils.logging.MarketIdLogger;

/**
 * Rabbit implementation of the {@link PriceDataGateway} for sending Market data.
 * 
 * @author Mark Pollack
 * @author Mark Fisher
 */
public class RabbitPriceDataGateway extends RabbitGatewaySupport implements PriceDataGateway {
	
	static Logger log = Logger.getLogger(RabbitPriceDataGateway.class.getName());
	
	private MessageProperties properties;
	
	/**
	 * Key to send price information.
	 */
	private static String PRICING_ROUTING_KEY = "com.bfair.pricing.price"; 
	
	@Autowired
	private PriceDataService priceDataService;

	@Autowired
	private MarketDataService marketDataService;


	public RabbitPriceDataGateway() {

	}

	private MessageProperties getMessageProperties() {
		if(properties == null) {
			properties = new MessageProperties();
			properties.setDeliveryMode(MessageDeliveryMode.PERSISTENT);
			properties.setContentType(MessageProperties.CONTENT_TYPE_JSON);
		} 
		return properties;
	}
	
	public void sendPriceData() {
		String[] changedIds = marketDataService.getChangedIds(); 
		priceDataService.recalculatePrices(changedIds);
		log.info("LOG4J - sendPriceData()"); 		
		for(String sid : priceDataService.getChangedIds()) {
			Price price = priceDataService.getPrice(sid);
			MarketIdLogger.debug(log, price.getMarketId(), "New Price for " + price.getSelectionId() +  " at: " + price.getTheoretical() + " (" + (new Date()).toString() + ")");
			getRabbitTemplate().convertAndSend(PRICING_ROUTING_KEY,
					MessageConverterFactory.getInstance(typeMapper()).toMessage(price, getMessageProperties()));
		}
		
	}

	private DefaultClassMapper typeMapper() {
		DefaultClassMapper typeMapper = new DefaultClassMapper();
		Map<String, Class<?>> idClassMapping = new HashMap<String, Class<?>>();
		idClassMapping.put("pricedto", Price.class);
		typeMapper.setIdClassMapping(idClassMapping);
		return typeMapper;
	}
}
