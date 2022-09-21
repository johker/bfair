package com.bfair.pricing.test;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.bfair.pricing.dto.utils.DataPriceComparator;
import com.bfair.pricing.stocks.dto.IData;
import com.bfair.pricing.stocks.dto.Item;
import com.bfair.pricing.utils.OutlierElimination;


public class TestOutlierElimination{

	
	List<IData> dataList;
	List<IData> expected;
	
	@Before
    public void setUp() throws Exception {
		dataList = new ArrayList<IData>(); 
		expected = new ArrayList<IData>(); 
    }

    @After
    public void tearDown() throws Exception {
    }

    
    @Test
    public void byQaurtilesPass() throws Exception {    	
    	List<? extends IData> actual = null;
    	int[] testactual = new int[]{5, 8, 4, 4, 6, 3, 8}; 
    	for(int ti : testactual){
    		IData data = new Item();
    		data.setPrice(ti); 
    		dataList.add(data);
    	}
    	actual = OutlierElimination.byQuartiles(dataList);
		int[] testexpected = new int[]{5, 8, 4, 4, 6, 8}; 
		for(int ti : testexpected){
    		IData data = new Item();
    		data.setPrice(ti); 
    		expected.add(data);    		
    	}
		Collections.sort(expected, new DataPriceComparator());
		assertTrue(expected.size() == actual.size());
		for(int index = 0; index < expected.size(); index++) {
			assertTrue(actual.get(index).getPrice() == expected.get(index).getPrice());
		}	
    }



}
