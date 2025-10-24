export REACT_APP_BUILD_TIMESTAMP=`date +%m%d%H%M`
echo $REACT_APP_BUILD_TIMESTAMP
#cleanup
#cleanup

rm -rf ./dist
rm -rf ./out

# add yarn
npm i -g yarn@1.22.21

# add turbo
npm i -g turbo@latest

# install dependencies
echo "Installing dependencies..."

yarn --frozen-lockfile

# build all packages

echo "Building packages..."

yarn turbo run generate
yarn turbo run build


# create dist

mkdir -p dist
  
#  ==========  API  =============

# prune to api production only

echo "Pruning api..."
turbo prune --scope=api --docker

# copy api files into dist

cp -r ./apps/api/dist ./dist/api

cp ./apps/api/package.json ./dist/api/package.json

cp -r ./apps/api/prisma ./dist/api/prisma


cd ./out/json

yarn install --production --frozen-lockfile

# copy node_modules into dist

echo "Copying api node_modules..."

cp -rL node_modules ../../dist/api/node_modules

cd ../

# copy packages dist node_modules

echo "Copying api packages..."

rm -rf ../dist/api/node_modules/@repo/helper

cp -rL ./full/packages/helper ../dist/api/node_modules/@repo/helper

cd ../

# replace prisma folders

yarn install

yarn generate

echo "Copying prisma folders..."

rm -rf ./dist/api/node_modules/prisma

cp -r node_modules/prisma ./dist/api/node_modules/prisma

rm -rf ./dist/api/node_modules/@prisma/client

cp -r node_modules/@prisma/client ./dist/api/node_modules/@prisma/client

rm -rf ./dist/api/node_modules/.prisma

cp -r node_modules/.prisma ./dist/api/node_modules/.prisma


# remove out files

rm -rf ./out


# copy ecosystem.config.js into dist

cp ./ecosystem.config.js ./dist/ecosystem.config.js

echo "Now run with 'pm2 start ./dist/ecosystem.config.js'"
