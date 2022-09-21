package com.bfair.pricing.stocks.dto;

import java.util.List;

public class Runner {

	private List<Item> availableToLay;	

	private List<Item> availableToBack; 
	
	private String selectionId; 
	
	public List<Item> getAvailableToLay() {
		return availableToLay;
	}

	public void setAvailableToLay(List<Item> availableToLay) {
		this.availableToLay = availableToLay;
	}

	public List<Item> getAvailableToBack() {
		return availableToBack;
	}

	public void setAvailableToBack(List<Item> availableToBack) {
		this.availableToBack = availableToBack;
	}

	public String getSelectionId() {
		return selectionId;
	}

	public void setSelectionId(String selectionId) {
		this.selectionId = selectionId;
	}

	
	
}
