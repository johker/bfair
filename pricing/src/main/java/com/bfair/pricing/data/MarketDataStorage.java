package com.bfair.pricing.data;


import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.log4j.Logger;

import com.bfair.pricing.dto.utils.MarketComparator;
import com.bfair.pricing.stocks.dto.Market;
import com.bfair.pricing.utils.logging.MarketIdLogger;

public class MarketDataStorage extends AbstractDataStorage {

	static Logger log = Logger.getLogger(MarketDataStorage.class.getName());
	
	private static MarketDataStorage instance = new MarketDataStorage(); 
	
	private Map<String, Market> markets = Collections.synchronizedMap(new TreeMap<String, Market>());
	
	private Comparator<Market> marketComparator = new MarketComparator(); 
		
	private MarketDataStorage() {

	}
	
	public static MarketDataStorage getInstance() {
		return instance;
	}
	
	public void addMarket(String id, Market market) {
		markets.put(id, market);
		changedIds.add(id); 
	}
	
	public Market getMarket(String id) {
		return markets.get(id);
	}
	
	public Set<String> getMarkets() {
		return markets.keySet();
	}

	/**
	 * 
	 * @param id
	 * @param market
	 * @return true if market already exists, false otherwise
	 */
	public boolean updateMarket(String id, Market market) {
		if(markets.containsKey(id)) {
			updateChanges(id, market);
			markets.remove(id);
			markets.put(id, market);
			return true;
		}
		addMarket(id, market);
		return false;
	}
	
	/**
	 * Checks if market object has changed and adds id 
	 * to List of changed ids if necessary. 
	 * @param mid
	 * @param market
	 */
	private void updateChanges(String mid, Market market) {
		if(marketComparator.compare(markets.get(mid), market) != 0) {
			MarketIdLogger.debug(log, markets.get(mid).getMarketId(), "Update Market Data (" + (new Date()).toString() + ", " + markets.get(mid).getMarketId() + ") - Changed Data");
			changedIds.add(mid);  
		} else {
			MarketIdLogger.debug(log, markets.get(mid).getMarketId(), "Update Market Data (" + (new Date()).toString() + ", " + markets.get(mid).getMarketId() + ") - No Changes");
			changedIds.remove(mid);
		}
	}
	
	
	
}
