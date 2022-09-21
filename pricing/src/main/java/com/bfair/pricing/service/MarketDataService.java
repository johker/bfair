package com.bfair.pricing.service;

import com.bfair.pricing.stocks.dto.Market;

public interface MarketDataService {

	void updateMarketData(Market market);
	
	String[] getChangedIds();
	
}
