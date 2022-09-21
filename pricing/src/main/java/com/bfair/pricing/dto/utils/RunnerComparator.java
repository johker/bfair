package com.bfair.pricing.dto.utils;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.bfair.pricing.stocks.dto.Item;
import com.bfair.pricing.stocks.dto.Runner;
import com.bfair.pricing.utils.NumberConverter;

public class RunnerComparator implements Comparator<Runner> {

	/**
	 * If the selection IDs don't match, the method returns the difference. Otherwise 
	 * it returns 0 if both sides are exactly the same and -1 if at least one <tt>Item</tt> 
	 * of one side differs.  
	 * @param r1 - Runner1
	 * @param r2 - Runner2
	 * @return 
	 */
	public int compare(Runner r1, Runner r2) {
		if(!r1.getSelectionId().equals(r2.getSelectionId())) {
			return NumberConverter.safeLongToInt(Long.parseLong(r1.getSelectionId()) - Long.parseLong(r2.getSelectionId())); 
		} else if(compareRunnerSide(r1.getAvailableToBack(), r2.getAvailableToBack()) == 0 &&
				compareRunnerSide(r1.getAvailableToLay(), r2.getAvailableToLay()) == 0 ) {
			return 0;
			
		} else return -1;
	}
	
	
	
	
	/**
	 * If the size of the lists matches the method compares 
	 * each of its <tt>Item</tt> objects after executing a sort.  
	 * @param items1
	 * @param items2
	 * @return
	 */
	public int compareRunnerSide(List<Item> items1, List<Item> items2) {
		if(items1.size() != items2.size()) {
			return -1;
		}		
		Comparator<Item> icmp = new ItemComparator();
		Collections.sort(items1, icmp);
		Collections.sort(items2, icmp);
		for(int i = 0; i < items1.size(); i++) {
			if(icmp.compare(items1.get(i), items2.get(i)) != 0) {
				return -1;
			}
		}
		return 0;
	}
	
	

}
