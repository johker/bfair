package com.bfair.pricing.stocks.dto;

import java.util.List;

public class Market {

	public Market() {
		
	}
	
	public Market(String marketId) {
		this.marketId = marketId;
	}

	private String marketId;

	private List<Runner> runners; 	

	public List<Runner> getRunners() {
		return runners;
	}

	public void setRunners(List<Runner> runners) {
		this.runners = runners;
	}

	public String getMarketId() {
		return marketId;
	}

	public void setMarketId(String marketId) {
		this.marketId = marketId;
	}

	
	
	
	
	
}
