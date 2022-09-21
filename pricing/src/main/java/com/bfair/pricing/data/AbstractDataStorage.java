package com.bfair.pricing.data;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public abstract class AbstractDataStorage {
	
	protected Set<String> changedIds = Collections.synchronizedSet(new HashSet<String>());;
		
	public String[] getChangedIds() {
		String[] cIds = changedIds.toArray(new String[0]);
		changedIds.clear();
		return cIds;
	}

}
