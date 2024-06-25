import chalk from "chalk";

export function log(...args: any[]) {
  console.log(chalk.white(...args));
}

export function important(...args: any[]) {
  console.log(chalk.blue(...args));
}

export function warn(...args: any[]) {
  console.warn(chalk.yellow(...args));
}

export function success(...args: any[]) {
  console.log(chalk.green(...args));
}

export function error(...args: any[]) {
  console.error(chalk.red(...args));
}
