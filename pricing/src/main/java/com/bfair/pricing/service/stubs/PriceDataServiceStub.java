package com.bfair.pricing.service.stubs;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;

import com.bfair.pricing.data.MarketDataStorage;
import com.bfair.pricing.data.PriceDataStorage;
import com.bfair.pricing.dto.utils.DataPriceComparator;
import com.bfair.pricing.exception.InsufficientDataException;
import com.bfair.pricing.service.PriceDataService;
import com.bfair.pricing.stocks.dto.IData;
import com.bfair.pricing.stocks.dto.Item;
import com.bfair.pricing.stocks.dto.Market;
import com.bfair.pricing.stocks.dto.Price;
import com.bfair.pricing.stocks.dto.Runner;
import com.bfair.pricing.utils.NumberConverter;
import com.bfair.pricing.utils.OutlierElimination;
import com.bfair.pricing.utils.logging.MarketIdLogger;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;

public class PriceDataServiceStub implements PriceDataService {

	static Logger log = Logger.getLogger(PriceDataServiceStub.class.getName());

	private Market getMarket(String id) {
		return MarketDataStorage.getInstance().getMarket(id);
	}

	private void updatePrice(Price price) {
		PriceDataStorage.getInstance().updatePrice(price.getSelectionId(),
				price);
	}

	public Price getPrice(String id) {
		return PriceDataStorage.getInstance().getPrice(id);
	}

	/**
	 * Updates the prices for every runner of the given market.
	 * @param mid MarketID 
	 */
	public void updatePrice(String mid) {
		double[] range = new double[2];
		Market market = getMarket(mid);
		for (Runner r : market.getRunners()) {
			try {
				if (r == null) {
					continue;
				}
				range = getPriceRange(r);
				MarketIdLogger.debug(log, mid, r.getSelectionId() + ": "	+ range[0] + ", " + range[1]);
				Price price = new Price();
				price.setMarketId(mid);
				price.setSelectionId(r.getSelectionId());				
				price.setTheoretical(getWeightedAverage(r, mid));
				MarketIdLogger.debug(log, mid, "New Price for ID: " + price.getMarketId() + ", SID: " + price.getSelectionId() + " at : " + price.getTheoretical() + " (" + (new Date()).toString() + ")");
				updatePrice(price);
			} catch (InsufficientDataException e) {
				log.debug("No Price Update (InsufficientDataException - SID: "
						+ r.getSelectionId() + ") : " + e.getMessage());
			}
		}

	}
	
	/**
	 * Calculates the weighted average of the best available back/lay
	 * for a runner. 
	 * @param runner
	 * @param marketId
	 * @return
	 */
	private double getWeightedAverage(Runner runner, String marketId) {
		List<Item> avToBack = runner.getAvailableToBack(); 
		List<Item> avToLay = runner.getAvailableToLay();
		Collections.sort(avToBack, new DataPriceComparator());
		Collections.sort(avToLay, new DataPriceComparator());
		Item bestAvToBack = avToBack.get(0); 
		Item bestAvToLay = avToLay.get(0);
		double volume = bestAvToBack.getSize() + bestAvToLay.getSize();
		double weigthedAverage = (bestAvToBack.getPrice() * bestAvToBack.getSize() + bestAvToLay.getPrice() * bestAvToLay.getSize()) / volume;
		MarketIdLogger.info(log, marketId, "bestAvToBack price = " + bestAvToBack.getPrice() + ", bestAvToLay price = " + bestAvToLay.getPrice() + " - RESULT = " + NumberConverter.roundToDigits(weigthedAverage, 2));
		return NumberConverter.roundToDigits(weigthedAverage, 2);
	}

	/**
	 * Calculates the boxplot bounds of the runner's prices (back and lay)
	 * @param runner
	 * @return - first and third quartile of all available data
	 * @throws InsufficientDataException
	 *             - thrown if not enough price data available for runner
	 */
	private double[] getPriceRange(Runner runner)
			throws InsufficientDataException {
		final Iterable<Item> all = Iterables
				.unmodifiableIterable(Iterables.concat(
						runner.getAvailableToBack(), runner.getAvailableToLay()));
		List<? extends IData> boxItems = OutlierElimination.byQuartiles(Lists
				.newArrayList(all));
		int size = boxItems.size();
		return new double[] { boxItems.get(0).getPrice(),
				boxItems.get(size - 1).getPrice() };
	}

	public String[] getChangedIds() {
		return PriceDataStorage.getInstance().getChangedIds();
	}

	public void recalculatePrices(String[] ids) {
		for (String id : ids) {
			updatePrice(id);
		}

	}

}
