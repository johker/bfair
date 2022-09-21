package com.bfair.pricing.dto.utils;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.bfair.pricing.stocks.dto.Market;
import com.bfair.pricing.stocks.dto.Runner;
import com.bfair.pricing.utils.NumberConverter;

public class MarketComparator implements Comparator<Market> {

	
	/**
	 * If the market IDs don't match, the method returns its difference. Otherwise 
	 * it returns 0 if both sides are exactly the same and -1 if at least one <tt>Runner</tt> 
	 * differs.  
	 * @param m1 - Market1
	 * @param m2 - Market2
	 * @return 
	 */
	public int compare(Market m1, Market m2) {		
		String mid1 = m1.getMarketId().substring(2, m1.getMarketId().length()- 1);
		String mid2 = m2.getMarketId().substring(2, m2.getMarketId().length()- 1);		
		if(!mid1.equals(mid2)) {
			return NumberConverter.safeLongToInt(Long.parseLong(mid1) - Long.parseLong(mid2)); 
		}  else if(compareMarketRunners(m1.getRunners(), m2.getRunners()) == 0 ) {
			return 0;
			
		} else return -1;
	}

	/**
	 * If the size of the lists matches the method compares 
	 * each of its <tt>Runner</tt> objects after executing a sort.  
	 * @param runners1
	 * @param runners2
	 * @return
	 */
	public int compareMarketRunners(List<Runner> runners1, List<Runner> runners2) {
		if(runners1.size() != runners2.size()) {
			return -1;
		}		
		Comparator<Runner> rcmp = new RunnerComparator();
		Collections.sort(runners1, rcmp);
		Collections.sort(runners1, rcmp);
		for(int i = 0; i < runners1.size(); i++) {
			if(rcmp.compare(runners1.get(i), runners2.get(i)) != 0) {
				return -1;
			}
		}
		return 0;
	}
	
	
	
}
