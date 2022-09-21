package com.bfair.pricing.dto.utils;

import java.util.Comparator;

import com.bfair.pricing.stocks.dto.Item;

public class ItemComparator implements Comparator<Item> {

	/**
	 * Return the difference between two <tt>Item</tt> objects where only the price 
	 * is relevent if price and size differ.
	 * @param i1 - Item1
	 * @param i2 - Item2
	 * @return 
	 */
	public int compare(Item i1, Item i2) {
		if(i1.getPrice() == i2.getPrice() && i1.getSize() == i2.getSize()) {
			return 0; 
		} else if(i1.getPrice() == i2.getPrice()) {
			return (int) Math.ceil(i1.getSize() - i2.getSize());
		} else {
			return (int) Math.ceil(i1.getPrice() - i2.getPrice());
		}
	}

}
