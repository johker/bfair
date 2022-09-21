package com.bfair.pricing.dto.utils;

import java.util.Comparator;

import com.bfair.pricing.stocks.dto.Price;

public class PriceComparator implements Comparator<Price> {

	public int compare(Price p1, Price p2) {
		return (int) Math.ceil(p1.getTheoretical() - p2.getTheoretical());
	}

}
