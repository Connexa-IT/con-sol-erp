import "dotenv/config";
import { TabidooApi } from "./tabidoo/api";
import { getWidgetForDir } from "./widgets/widgets";
import { loadConfig, WidgetConfig } from "./config/config";
import { log, success, important, error, warn } from "./util/logger";

async function syncWidgetsForApp(
  appName: string,
  widgetsFromConfig: WidgetConfig[],
  api: TabidooApi
) {
  log(`Syncing widgets for ${appName}...`);

  const { data } = await api.getCustomScripts();

  if (!data) {
    error(`No data returned. Application ${appName} do not exists?`);
    return;
  }

  const toUpdate = data.filter((script) => {
    const widget = widgetsFromConfig.find((w) => w.name === script.fields.name);
    return widget !== undefined;
  });

  const toCreate = widgetsFromConfig.filter((w) => {
    const script = data.find((s) => s.fields.name === w.name);
    return script === undefined;
  });

  log(`${toUpdate.length} widgets to update`);
  log(`${toCreate.length} widgets to create`);

  for (const widget of toCreate) {
    log(`Creating widget ${widget.name}`);

    const localWidget = await getWidgetForDir(widget.path);
    if (!localWidget) {
      warn(
        `Unable to load widget ${widget.name} in ${widget.path}. Skipping...`
      );
      continue;
    }

    await api.createCustomScript({
      fields: {
        name: widget.name,
        namespace: widget.name,
        interface: localWidget.interface,
        dts: { writtenTypeScript: localWidget.dts },
        script: { runableSript: localWidget.script },
        scriptOrder: 0,
      },
    });
  }

  for (const widget of toUpdate) {
    const widgetFromConfig = widgetsFromConfig.find(
      (w) => w.name === widget.fields.name
    );
    if (!widgetFromConfig) {
      continue;
    }
    const localWidget = await getWidgetForDir(widgetFromConfig.path);
    if (!localWidget) {
      warn(
        `Unable to load widget ${widgetFromConfig.name} in ${widgetFromConfig.path}. Skipping...`
      );
      continue;
    }

    log(`Updating widget ${widgetFromConfig.name} (${widget.id})`);
    await api.updateCustomScript(widget.id, {
      fields: {
        name: localWidget.name,
        namespace: localWidget.name,
        interface: localWidget.interface,
        dts: { writtenTypeScript: localWidget.dts },
        script: { runableSript: localWidget.script },
        scriptOrder: 0,
      },
    });
  }
}

async function start() {
  const config = loadConfig(process.env.CONFIG_PATH || "config.yaml");

  for (const appName in config.apps) {
    important(`Starting to sync widgets for ${appName}`);
    const appConfig = config.apps[appName];

    const token = process.env[appConfig.apiTokenEnv];
    if (!token) {
      error(`Missing API token ${appConfig.apiTokenEnv} for ${appName}`);
      process.exit(1);
    }

    const api = new TabidooApi({
      token: token,
      appId: appName,
    });

    const apiReady = await api.ping();
    if (!apiReady) {
      error(`Tabidoo API does not respond. Exiting...`);
      process.exit(1);
    }

    await syncWidgetsForApp(appName, appConfig.widgets, api);

    success(`Finished sync widgets for ${appName}`);
  }
}

start();
