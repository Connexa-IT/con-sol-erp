import * as fs from "fs";
import { parse } from "yaml";
import { error } from "../util/logger";

export interface WidgetConfig {
  name: string;
  path: string;
}

export interface AppConfig {
  widgets: WidgetConfig[];
  apiTokenEnv: string;
}

export interface Config {
  apps: {
    [key: string]: AppConfig;
  };
}

export function loadConfig(filePath: string): Config {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = parse(fileContents) as Config;
    return data;
  } catch (e) {
    error(`Failed to load config file: ${e}`);
    throw e;
  }
}
