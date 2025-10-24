

## compare and generate changes
```
./node_modules/prisma/build/index.js  format
./node_modules/prisma/build/index.js  generate
./node_modules/prisma/build/index.js  migrate dev
```


## manually execute the script to sync database
```
./node_modules/prisma/build/index.js  migrate deploy --schema=./prisma/schema.prisma
```
 