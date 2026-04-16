module.exports = {
  apps: [
    {
      name: "voyagr",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3050",
      cwd: "/home/empcloud-development/voyagr",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3050",
      },
    },
  ],
};
