package com.bfair.pricing.service;

import com.bfair.pricing.stocks.dto.Price;

public interface PriceDataService {

	/**
	 * Recalculate price for given id. 
	 * @param id
	 */
	void updatePrice(String id);
	
	/** 
	 * Get price by its selection id.
	 * @param id
	 * @return
	 */
	Price getPrice(String id);
	
	/**
	 * Updates all prices if its underlying market data
	 * has changed.
	 * @param ids - Array of Ids with changed market data. 
	 */
	void recalculatePrices(String[] ids);
	
	/**
	 * Get ids of price that have changed.
	 * @return
	 */
	String[] getChangedIds();
	

	
		
}
