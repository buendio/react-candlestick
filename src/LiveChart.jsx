import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { candleStickOptions } from './constants'

const LiveChart = ({ symbol = 'btcusdt' }) => {
    const [stockData, setStockData] = useState([])

    useEffect(() => {
        const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@kline_1m`;
        console.log(`Connecting to WebSocket at: ${wsUrl}`);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket connection opened");
        }

        ws.onmessage = (event) => {
            console.log("Received WebSocket message:", event.data); // Логируем все входящие сообщения
            const message = JSON.parse(event.data);

            if (message.k && message.k.x) { // Проверяем, что свеча завершена
                const newCandle = {
                    x: new Date(message.k.t), // Время открытия свечи
                    y: [
                        parseFloat(message.k.o), // Цена открытия
                        parseFloat(message.k.h), // Максимум
                        parseFloat(message.k.l), // Минимум
                        parseFloat(message.k.c), // Цена закрытия
                    ]
                }

                setStockData(prevData => [...prevData.slice(-99), newCandle]); // Обновляем данные графика
            }
        }

        ws.onerror = (error) => {
            console.error("WebSocket error:", error); // Логируем ошибку
        }

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        }

        return () => {
            ws.close(); // Закрываем WebSocket при размонтировании
        }
    }, [symbol])

    const seriesData = useMemo(() => stockData.length ? stockData : [{ x: new Date(), y: [0, 0, 0, 0] }], [stockData])

    return (
        <ReactApexChart
            series={[{ data: seriesData }]}
            options={candleStickOptions}
            type="candlestick"
            height="350"
        />
    )
}

export default LiveChart
