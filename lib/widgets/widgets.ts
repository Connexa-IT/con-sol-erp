import * as fs from "fs/promises";
import * as path from "path";

const WIDGET_DIR = "./widgets";

interface Widget {
  name: string;
  dts: string;
  interface: string;
  script: string;
}

export async function getLocalWidgets(
  baseDir: string = WIDGET_DIR
): Promise<Widget[]> {
  const directories = await fs
    .readdir(baseDir, { withFileTypes: true })
    .then((files) => files.filter((file) => file.isDirectory()))
    .then((files) => files.map((file) => file.name));

  const widgets: Widget[] = [];
  for (const dir of directories) {
    const widget = await getWidgetForDir(path.join(baseDir, dir), dir);
    if (widget) {
      widgets.push(widget);
    }
  }

  return widgets;
}

async function getWidgetForDir(
  dirPath: string,
  dirName: string
): Promise<Widget | undefined> {
  const dtsPath = path.join(dirPath, "d.ts");
  const scriptPath = path.join(dirPath, "script.js");
  try {
    fs.access(dtsPath);
    fs.access(scriptPath);

    const dtsContent = (await fs.readFile(dtsPath)).toString();
    const scriptContent = (await fs.readFile(scriptPath)).toString();
    const interfaceName = dtsContent.match(/interface (\w+)/)?.[1] || undefined;

    if (interfaceName === undefined) {
      console.warn(
        `Unable to get interface name for widget ${dirPath}. Skipping...`
      );
      return undefined;
    }

    return {
      name: dirName,
      dts: dtsContent,
      script: scriptContent,
      interface: interfaceName,
    } as Widget;
  } catch (error: any) {
    console.warn(
      `Error while processing widget ${dirPath}: ${error.message}. Skipping...`
    );
  }
  return undefined;
}
