import './App.css'
import LiveChart from './LiveChart'

function App() {

  return (
    <>
      <h1>
        Cryptocurrency Candlestick Chart
      </h1>
   
      <LiveChart symbol={'btcusdt'} />
    </>
  )
}

export default App
