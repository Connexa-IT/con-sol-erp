export interface ResponsePayload<T> {
  data: T;
}

export interface Script {
  runableSript: string;
}

export interface Dts {
  writtenTypeScript: string;
}

export interface Fields {
  name: string;
  namespace: string;
  interface: string;
  dts: Dts;
  script: Script;
  scriptOrder: number;
}

export interface CustomScriptResponse {
  id: string;
  created: string;
  modified: string;
  ver: number;
  fields: Fields;
}

export interface CreateCustomScriptRequest {
  fields: Fields;
}

export interface UpdateCustomScriptRequest extends CreateCustomScriptRequest {}
