export class APILogger{

    private recentLogs: any[] = [];

    logRequest(method: string, url: string, headers: Record<string, string>, body?: any){
        //collect datapoints
        const logEntry = {
            timestamp: new Date().toISOString(),
            method,
            url,
            headers,
            body
        };
        this.recentLogs.push({type: 'Request Details', data: logEntry});
        if(this.recentLogs.length > 10){
            this.recentLogs.shift(); //keep only last 10 logs
        }
    }

    logResponse(statusCode: number, body?: any){
        //collect datapoints
        const logEntry = {
            timestamp: new Date().toISOString(),
            statusCode,
            body
        };
        this.recentLogs.push({type: 'Response Details', data: logEntry});
        if(this.recentLogs.length > 10){
            this.recentLogs.shift(); //keep only last 10 logs
        }
    }

    getRecentLogs(){
        const logs = this.recentLogs.map(log => {
            return `[===${log.type}=== at ${log.data.timestamp}]: ${JSON.stringify(log.data, null, 4)}`;
        }).join('\n\n');
        return logs;
    }
}