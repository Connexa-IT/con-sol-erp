import * as fs from "fs/promises";
import * as path from "path";

interface Widget {
  name: string;
  dts: string;
  interface: string;
  script: string;
}

export async function getWidgetForDir(
  dirPath: string
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
