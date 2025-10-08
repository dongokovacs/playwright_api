import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler{

    private request: APIRequestContext
    private logger: APILogger
    private baseUrl: string | undefined;
    private defaultBaseUrl: string ;
    private apiPath: string= '';
    private queryParams: object = {};
    private apiHeaders: Record <string,string> = {};
    private apiBody: object = {};
    private defaultAuthToken: string;
    private clearAuthFlag: boolean = false;

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger, authToken: string = ''){
        this.defaultBaseUrl = apiBaseUrl;
        this.request = request;
        this.logger = logger;
        this.defaultAuthToken = authToken;
    }

    url(url: string){
        this.baseUrl = url;
        return this;
    }

    path(path: string){
        this.apiPath = path;
        return this;    
    }

    params(params: object){
        this.queryParams = params;
        return this;
    }

    headers(headers: Record <string,string>){
        this.apiHeaders = headers;
        return this;
    }

    body(body: object){
        this.apiBody = body;
        return this;
    }

    clearAuth(){
        this.clearAuthFlag = true;
        return this;
    }

    async getRequest(expectedStatus: number){
        const url = this.getUrl();
        this.logger.logRequest('GET', url, this.getHeaders())
        const response = await this.request.get(url, {
            headers: this.getHeaders()
        });
        this.cleanUpFields()
        const actualStatus = response.status()
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON)
        expect(actualStatus).toEqual(expectedStatus);
        return responseJSON;
    }

    async postRequest(expectedStatus: number){
        const url = this.getUrl();
        this.logger.logRequest('POST', url, this.getHeaders(), this.apiBody)
        const response = await this.request.post(url, {
            headers: this.getHeaders(),
            data: this.apiBody
        });
        this.cleanUpFields()
        const actualStatus = response.status()
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON)
        expect(actualStatus).toEqual(expectedStatus);
        return responseJSON;
    }

    async putRequest(expectedStatus: number){
        const url = this.getUrl();
        this.logger.logRequest('PUT', url, this.getHeaders(), this.apiBody)
        const response = await this.request.put(url, {
            headers: this.getHeaders(),
            data: this.apiBody
        });
        this.cleanUpFields()
        const actualStatus = response.status()
        const responseJSON = await response.json();
        this.logger.logResponse(actualStatus, responseJSON)
        expect(actualStatus).toEqual(expectedStatus);
        return responseJSON;
    }

    async deleteRequest(expectedStatus: number){
        const url = this.getUrl();
        this.logger.logRequest('DELETE', url, this.getHeaders())
        const response = await this.request.delete(url, {
            headers: this.getHeaders()
        });
        this.cleanUpFields()
        const actualStatus = response.status()
        this.logger.logResponse(actualStatus)
        expect(actualStatus).toEqual(expectedStatus);
    }

    private getUrl(){
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);
        for (const [key, value] of Object.entries(this.queryParams)){
            url.searchParams.append(key, value);
        }
        //console.log(url)
        return url.toString();
    }

    private statusCodeValidator(actualStatus: number, expectedSstatus: number){
        if (actualStatus !== expectedSstatus) {
            const logs = this.logger.getRecentLogs()
            const error = new Error(`Expected status ${expectedSstatus}, but got: ${actualStatus} \n\nRecent API activity: \n${logs}`)
            throw error
        }
    }

    private getHeaders(){
        //write default values to the header
        if (!this.clearAuthFlag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] ?? this.defaultAuthToken;
        }
        return this.apiHeaders;
    }

    private cleanUpFields(){
        this.apiBody = {}
        this.apiHeaders = {}
        this.baseUrl = undefined
        this.apiPath = ''
        this.queryParams = {}
        this.clearAuthFlag = false;
    }


}