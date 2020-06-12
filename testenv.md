# Set up a testing environment

Work in progress!


todo to make this work:

- create yarn start:dev command for cloudfunctions
- create yarn start:dev command for listener
- create yarn start:dev command for common
- Question: the relayer will of course not work. What can we do? Can we work around this?

Each of these steps in a separate shell

## 1. Run blockchain and graphql server

We have docker containers with contracts already deployed, which is convenient 

```
git clone https://github.com/daostack/arc.js.git
cd arc.js
git checkout 2.0.0-experimental.39 // <-- please check if you have the correct version
docker-compose up
```

## 2. Run cloud functions

```
git clone https://github.com/daostack/common-cloudfunctions.git
cd common-cloudfunctions
cd functions
yarn start:dev  <- TODO: this will connect to the local instances started in step 1
// visit local URLS to update-daos, proposals, votes
```


## 3. Run cloud watcher



## 4. Run the application in dev mode

Start application with `yarn ios:dev`




