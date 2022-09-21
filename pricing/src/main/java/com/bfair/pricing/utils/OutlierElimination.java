package com.bfair.pricing.utils;

import java.util.Collections;
import java.util.List;

import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;

import com.bfair.pricing.dto.utils.DataPriceComparator;
import com.bfair.pricing.exception.InsufficientDataException;
import com.bfair.pricing.stocks.dto.IData;


public class OutlierElimination {

	/**
	 * Removes items whose prices are not in the interquartile range. 
	 * @param items -a list of data objects
	 * @return a list of elements positioned in the box of the original list
	 * @throws InsufficientDataException - thrown if list contains less than four elements
	 */
	public static List<? extends IData> byQuartiles(List<? extends IData> items) throws InsufficientDataException {
		if(items.size() < 4) {
			throw new InsufficientDataException("This method is not designed to handle lists with fewer than 4 elements.");
		}
		DescriptiveStatistics stats = new DescriptiveStatistics();
		for(IData idata : items) {
			stats.addValue(idata.getPrice());
		}
		double fquatile = stats.getPercentile(25);
		double tquartile = stats.getPercentile(75);
		
		Collections.sort(items, new DataPriceComparator());
		for(int i = 0; i < items.size(); i++) {
			if(items.get(i).getPrice() > tquartile) {
				items.remove(i);
			} else if(items.get(i).getPrice() < fquatile) {
				items.remove(i);
			}
		}
		return items;
		
		
	}
	
	
}
