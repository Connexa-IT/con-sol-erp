import "dotenv/config";
import { TabidooApi } from "./tabidoo/api";
import { getLocalWidgets } from "./widgets/widgets";

const api = new TabidooApi({
  token: process.env.TABIDOO_API_TOKEN ?? "",
  appId: process.env.TABIDOO_APP_ID ?? "",
});

async function syncWidgets() {
  console.log("Syncing widgets...");

  const { data } = await api.getCustomScripts();
  const localWidgets = await getLocalWidgets();

  const toUpdate = data.filter((script) => {
    const widget = localWidgets.find((w) => w.name === script.fields.name);
    return widget !== undefined;
  });

  const toCreate = localWidgets.filter((w) => {
    const script = data.find((s) => s.fields.name === w.name);
    return script === undefined;
  });

  console.log(`${toUpdate.length} widgets to update`);
  console.log(`${toCreate.length} widgets to create`);

  for (const widget of toCreate) {
    console.log(`Creating widget ${widget.name}`);
    await api.createCustomScript({
      fields: {
        name: widget.name,
        namespace: widget.name,
        interface: widget.interface,
        dts: { writtenTypeScript: widget.dts },
        script: { runableSript: widget.script },
        scriptOrder: 0,
      },
    });
  }

  for (const widget of toUpdate) {
    const localWidget = localWidgets.find((w) => w.name === widget.fields.name);
    if (!localWidget) {
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
  const apiReady = await api.ping();
  if (!apiReady) {
    console.error(`Tabidoo API does not respond. Exiting...`);
    process.exit(1);
  }

  await syncWidgets();
}

start();
