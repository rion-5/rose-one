import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('http://localhost:8443/tradeDataForChart?symbol=AAPL&start_date=2024-01-01&end_date=2024-01-10');
    
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    // Extract the first element of the array and then access `series`
    const series = data[0].series;

    // Map through the series to transform data into the TradeData structure
    const parsedData = series.map((d: { name: string; value: number }) => ({
        trading_date: new Date(d.name).toISOString().split('T')[0].replace(/-/g, '/'), // Convert date to yyyy/mm/dd
        close: d.value.toFixed(2) // Format close price to 2 decimal places
    }));

    return {
        tradeData: parsedData
    };
};
