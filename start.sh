# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

#!/bin/sh

set -ex
npx prisma migrate deploy
npm install -g tsconfig-paths # try this for prod
npx prisma db seed # seed the db with data just the first time, then comment this line out
npm uninstall -g tsconfig-paths # clean up for prod
npm run start
