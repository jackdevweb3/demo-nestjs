module.exports = {
  apps: [
    {
      name: '13501-demo-service',
      script: './api/main.js',

      kill_timeout: 10000,
      instances: '1',
      exec_mode: 'cluster',

      max_memory_restart: '2048M',
      node_args: '--max-old-space-size=2048',
      args: '',
      env: {
        PORT_API: 13501,

        NODE_ENV: 'development',

        ENABLE_CRON_JOB: true,

        HOST_ID: 1,

        DATABASE_URL: 'postgresql://postgres:<password>@localhost:5432/demo-service?schema=public',

         
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PWD: 'xxxx',
        REDIS_DB: 5,
        USE_SENTINEL: false,
        SENTINEL_HOSTS: 'localhost:26379,localhost:26380,localhost:26381',
        SENTINEL_NAME: 'myredismaster',
        SENTINEL_REDIS_PWD: 'xxxx',
        SENTINEL_REDIS_DB: 1,

        ENABLE_KAFKA_PRODUCER: 'false',
        ENABLE_KAFKA_CONSUMER: 'false',
        KAFKA_BROKERS: 'localhost:9092',
        KAFKA_CLIENT_ID: 'demo-service-client',
        KAFKA_GROUP_ID: 'demo-service-group',

        ENABLE_SW: false, 

        IS_DEVMODE : true         
      },
    },
  ],
};
