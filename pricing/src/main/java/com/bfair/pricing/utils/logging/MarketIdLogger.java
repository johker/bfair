package com.bfair.pricing.utils.logging;

import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.log4j.Logger;

import com.bfair.pricing.config.server.StaticContextAccessor;

public class MarketIdLogger {
		
	private static PropertiesConfiguration config = StaticContextAccessor.getBean(PropertiesConfiguration.class);
		
	public static void info(Logger logger,String id, String message) {		
		if(id.equals((String) config.getProperty("MARKET_ID_TO_WATCH"))) {
			logger.info(message);
		}
	}	
	
	public static void debug(Logger logger,String id, String message) {
		if(id.equals((String) config.getProperty("MARKET_ID_TO_WATCH"))) {
			logger.debug(message);
		}
	}	
}
