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
package com.bfair.pricing.handler;

import com.bfair.pricing.service.MarketDataService;
import com.bfair.pricing.stocks.dto.Market;


/**
 * POJO handler that receives trade requests and sends back a trade response.  Main application
 * logic sits here which coordinates between {@link MarketDataService} , ....
 * 
 * @author Mark Pollack
 *
 */
public class ServerHandler {

    
    private MarketDataService marketDataService;   
   
	public ServerHandler(MarketDataService marketDataService) {
		this.marketDataService = marketDataService;
	}
	
	/**
	 * Expects Price object or void as return type.
	 * @param market
	 */
	public void handleMessage(Market market) {
		marketDataService.updateMarketData(market);
		
	}
		
	
	
}
