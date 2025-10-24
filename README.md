# Demo Service
 
## API

#### Requirement:
- Node.js  > 18+ 
- Redis standalone in local 
- Postgresql database in local 

### Quick steps

#### Install yarn to manage package
```
npm install -g yarn
```

#### ENV
 
- copy **.env.example** to **.env** and check env variables in **.env** file
    - PORT_API
    - DATABASE_URL
    - REDIS_HOST
    - ENABLE_API_DOC_FOR_DEVELOPMENT

#### Install Packages
```
yarn
```

#### setup database
```
- create database
- sync tables, refer to ./prisma/README.md

```


#### Run
```
yarn dev
```
 
visit http://localhost:13501/api-doc
