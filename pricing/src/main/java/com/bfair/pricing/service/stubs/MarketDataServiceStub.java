package com.bfair.pricing.service.stubs;

import org.apache.log4j.Logger;

import com.bfair.pricing.data.MarketDataStorage;
import com.bfair.pricing.service.MarketDataService;
import com.bfair.pricing.stocks.dto.Market;



public class MarketDataServiceStub implements MarketDataService {

	static Logger log = Logger.getLogger(MarketDataServiceStub.class.getName());
	
	public void updateMarketData(Market market) {		
		MarketDataStorage.getInstance().updateMarket(market.getMarketId(), market);
	}

	public String[] getChangedIds() {
		return MarketDataStorage.getInstance().getChangedIds();
	}

}
