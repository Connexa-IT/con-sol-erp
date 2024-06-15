import "dotenv/config";
import { TabidooApi } from "./tabidoo/api";
import { getWidgetForDir } from "./widgets/widgets";
import { loadConfig, WidgetConfig } from "./config/config";

async function syncWidgetsForApp(
  widgetsFromConfig: WidgetConfig[],
  api: TabidooApi
) {
  console.log("Syncing widgets...");

  const { data } = await api.getCustomScripts();

  const toUpdate = data.filter((script) => {
    const widget = widgetsFromConfig.find((w) => w.name === script.fields.name);
    return widget !== undefined;
  });

  const toCreate = widgetsFromConfig.filter((w) => {
    const script = data.find((s) => s.fields.name === w.name);
    return script === undefined;
  });

  console.log(`${toUpdate.length} widgets to update`);
  console.log(`${toCreate.length} widgets to create`);

  for (const widget of toCreate) {
    console.log(`Creating widget ${widget.name}`);

    const localWidget = await getWidgetForDir(widget.path);
    if (!localWidget) {
      console.warn(
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
      console.warn(
        `Unable to load widget ${widgetFromConfig.name} in ${widgetFromConfig.path}. Skipping...`
      );
      continue;
    }

    console.log(`Updating widget ${localWidget.name} (${widget.id})`);
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
    console.log(`Starting to sync widgets for ${appName}`);
    const appConfig = config.apps[appName];

    const token = process.env[appConfig.apiTokenEnv];
    if (!token) {
      console.error(
        `Missing API token ${appConfig.apiTokenEnv} for ${appName}`
      );
      process.exit(1);
    }

    const api = new TabidooApi({
      token: token,
      appId: appName,
    });

    const apiReady = await api.ping();
    if (!apiReady) {
      console.error(`Tabidoo API does not respond. Exiting...`);
      process.exit(1);
    }

    await syncWidgetsForApp(appConfig.widgets, api);

    console.log(`Finished sync widgets for ${appName}`);
  }
}

start();
