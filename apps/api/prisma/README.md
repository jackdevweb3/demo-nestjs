
# export env
export DATABASE_URL=postgresql://postgres:<password>@localhost:5432/demo-service?schema=public
 
cd apps/api/


### [DEV Mode]
## compare and generate changes
```
./../../node_modules/prisma/build/index.js  format
./../../node_modules/prisma/build/index.js  generate
./../../node_modules/prisma/build/index.js  migrate dev
```


### [DEV Mode]
## manually execute the existing scripts to sync database
```
./../../node_modules/prisma/build/index.js  migrate deploy --schema=./prisma/schema.prisma
```
 