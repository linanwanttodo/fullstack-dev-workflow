import { exec } from "node:child_process";

export function runPing(host) {
  return new Promise((resolve, reject) => {
    exec(`ping -c 1 ${host}`, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}