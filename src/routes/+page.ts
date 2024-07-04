import type { PageLoad } from './$types';

export const load = (async ({data}) => {
  // 서버에서 전달된 데이터를 가공
  const processedData = data.data.map(item  => ({
    ...item,
    trading_date: new Date(item.trading_date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }), // 날짜 형식 변경
    close: item.close.toFixed(2) // 소수점 2자리까지 반올림
  }));
//   console.log('Processed data:', processedData);

  return { data: processedData };
}) satisfies PageLoad;


// export const load = (async ({data}) => {
//     // 서버에서 전달된 데이터를 가공
//     const processedData = data.data;
  
//     return { data: processedData };
//   }) satisfies PageLoad;