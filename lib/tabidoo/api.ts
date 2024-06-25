import { error } from "../util/logger";
import {
  CustomScriptResponse,
  ResponsePayload,
  CreateCustomScriptRequest,
  UpdateCustomScriptRequest,
} from "./types";

export interface TabidooApiOptions {
  token: string;
  appId: string;
  apiUrl?: string;
}

export class TabidooApi {
  private options: TabidooApiOptions;

  constructor(options: TabidooApiOptions) {
    if (!options.token) {
      throw new Error("Missing Tabidoo API token");
    }
    if (!options.apiUrl) {
      options.apiUrl = "https://app.tabidoo.cloud/api/v2";
    }
    this.options = options;
  }

  async ping(): Promise<boolean> {
    try {
      const response = await fetch(this.buildUrl("/ping"), {
        method: "GET",
        headers: this.buildHeaders(),
      });
      return response.status === 200;
    } catch (e) {
      error(e);
      return false;
    }
  }

  async getCustomScripts(): Promise<ResponsePayload<CustomScriptResponse[]>> {
    const response = await fetch(
      this.buildUrl(`/apps/${this.options.appId}/tables/customscripts/data`),
      {
        method: "GET",
        headers: this.buildHeaders(),
      }
    );
    return response.json();
  }

  async createCustomScript(
    fields: CreateCustomScriptRequest
  ): Promise<boolean> {
    const response = await fetch(
      this.buildUrl(`/apps/${this.options.appId}/tables/customscripts/data`),
      {
        method: "POST",
        headers: this.buildHeaders(),
        body: JSON.stringify(fields),
      }
    );
    if (response.status === 200) {
      return true;
    }
    error(response.status, await response.text());
    return false;
  }

  async updateCustomScript(
    recordId: string,
    fields: UpdateCustomScriptRequest
  ): Promise<boolean> {
    const response = await fetch(
      this.buildUrl(
        `/apps/${this.options.appId}/tables/customscripts/data/${recordId}`
      ),
      {
        method: "PATCH",
        headers: this.buildHeaders(),
        body: JSON.stringify(fields),
      }
    );
    if (response.status === 200) {
      return true;
    }
    error(response.status, await response.text());
    return false;
  }

  private buildUrl(path: string) {
    return `${this.options.apiUrl}${path}`;
  }

  private buildHeaders() {
    return {
      Authorization: `Bearer ${this.options.token}`,
      "Content-Type": "application/json",
    };
  }
}
