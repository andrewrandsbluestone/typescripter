import {useEffect, useState} from "react";

interface forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

export function FetchData() {
    const [loading, setLoading] = useState(false);
    const [forecasts, setForecasts] = useState<forecast[]>([]);

    useEffect(() => {
        async function http<T>(request: RequestInfo): Promise<T> {
            const response = await fetch(request);
            const body = await response.json();
            return body;
        }
        const populateWeatherData = async () => {
            setLoading(true);
            const data = await http<forecast[]>("weatherforecast");
            setForecasts(data);
            setLoading(false);
        }

        populateWeatherData();
    }, []);

   
  const renderForecastsTable = (fc: forecast[]) => {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {fc.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

    let contents = loading
      ? <p><em>Loading...</em></p>
      : renderForecastsTable(forecasts);

    return (
      <div>
        <h1 id="tabelLabel" >Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
 
}
