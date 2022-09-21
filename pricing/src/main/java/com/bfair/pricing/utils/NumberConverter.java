package com.bfair.pricing.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class NumberConverter {

	/**
	 * Safe casting of long to int in Java.
	 * @param l - long value to cast
	 * @return corresponding integer value
	 * @throws IllegalArgumentException - if no cast without value transformation is possible. 
	 */
	public static int safeLongToInt(long l) throws IllegalArgumentException {
	    if (l < Integer.MIN_VALUE || l > Integer.MAX_VALUE) {
	        throw new IllegalArgumentException
	            (l + " cannot be cast to int without changing its value.");
	    }
	    return (int) l;
	}
	
	/**
	 * Round a number to n decimal places.
	 * @param value
	 * @param digits
	 * @return
	 */
	public static double roundToDigits(double value, int digits) {
		BigDecimal bd = new BigDecimal(value).setScale(digits, RoundingMode.HALF_EVEN);
		return bd.doubleValue();
	}
	
}
