package com.bfair.pricing.stocks.dto;

/**
 * Represents abstract data point
 * @author kern
 *
 */
public interface IData {

	public double getSize();
	
	public void setSize(double size);

	public double getPrice();

	public void setPrice(double price);
	
	
}
