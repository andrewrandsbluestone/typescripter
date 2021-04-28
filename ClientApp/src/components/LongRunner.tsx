import React, { useState, useEffect } from "react";

export function LongRunner() {
    const [message, setMessage] = useState("waiting");
    const [isPolling, setIsPolling] = useState(false);
    const [pollingToken, setPollingToken] = useState<string>();

    useEffect(() => {

        async function http<T>(request: RequestInfo): Promise<T> {
            console.log(`req: ${request}`);
            const response = await fetch(request);
            const body = await response.json();
            return body;
        }
        const determineIfProcessing = async () => {
            const busy = await http<boolean>(`getBusy/pollForResult/${pollingToken}`);
            console.log(`polling: ${busy}`);
            setIsPolling(busy);
            if (!busy)
                // can now fetch the results
                setMessage("done!");
        }

        const interval = setInterval(() => {
            if (!isPolling)
                return;
            determineIfProcessing();
            console.log('This will run every second!');
        }, 1000);
        return () => clearInterval(interval);
    }, [isPolling]);

    const post = async (request: string) => {
        setMessage("working...");

        const body = {
            name: "test"
        };

        const response = await fetch(request,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                }
            });
        const id = await response.json();
        setPollingToken(id);
    };

    const handlePollingTask = async () => {

        await post("GetBusy/Poll");
        setIsPolling(true);

        setMessage("still working");
    };

    const handleLongRunningTask = async() => {
        await post("GetBusy/Block");
        setMessage("working...done");
    };

    const handleOtherButton = async () => {
        console.log("Go pressed!");
    };

    return (
      <div>
            <button className="btn btn-primary" onClick={handleLongRunningTask}>Run Task</button>
            <button className="btn btn-primary" onClick={handlePollingTask}>Start Polled Task</button>
            <button className="btn btn-primary" onClick={handleOtherButton}>Go!</button>

            <p aria-live="polite">{message}</p>

      </div>
    );
}
