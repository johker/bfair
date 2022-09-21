package com.bfair.pricing.exception;


/**
 * Thrown if selected operation is not possible with current data.
 * @author kern
 *
 */
public class InsufficientDataException extends Exception {
	
	private static final long serialVersionUID = 2632403440041684858L;

    public InsufficientDataException(String message) {
        super(message);
    }
}
