package com.bfair.pricing.stocks.dto;

public class Price {
	
	private double theoretical;
	
	private String marketId;
	
	private String selectionId;
	
	public String getSelectionId() {
		return selectionId;
	}

	public void setSelectionId(String selectionId) {
		this.selectionId = selectionId;
	}

	public double getTheoretical() {
		return theoretical;
	}

	public void setTheoretical(double theoretical) {
		this.theoretical = theoretical;
	}

	public String getMarketId() {
		return marketId;
	}

	public void setMarketId(String marketId) {
		this.marketId = marketId;
	}
	
	

}
