import type { PageLoad } from './$types';

interface TradeData {
    trading_date: string;
    close: string;
}

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('${apiBaseUrl}/tradeDataForChart?symbol=TSLA&start_date=2024-01-01&end_date=2024-07-30');

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const data: { name: string; series: { name: string; value: number }[] }[] = await response.json();

    // 데이터 추출 및 변환
    const tradeData: TradeData[] = data[0].series.map((d) => ({
        trading_date: new Date(d.name).toISOString().split('T')[0].replace(/-/g, '/'),
        close: d.value.toFixed(2)
    }));

    return {
        tradeData
    };
};
