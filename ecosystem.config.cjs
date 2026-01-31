module.exports = {
  apps: [
    {
      name: "volta-next",
      cwd: "/home/ardhi/volta",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      env: { NODE_ENV: "production" },
    },
  ],
};
