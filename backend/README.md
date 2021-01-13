# backend
In this part of the project we decided to work with a Neo4j database, because the graph based
approach seemed very interesting and we wanted to play around with it. 

## Project setup
```
cd backend
```
```
npm install
```
The backend of this application is hooked up to a Neo4j Database. In order to work with it, you can
install Docker on your computer and run a Neo4j container.

For installing Docker on an Ubuntu machine you could use:
```
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

For installation on an Arch Linux based system use:
```
sudo pacman -Syu
sudo pacman -S docker
```

For installation on Windows...

...but who uses that anyway ;)

Once Docker is up and running all you need to do is start the Neo4j container.
You can pull it simply via:
```
docker run  --publish=7474:7474 --publish=7687:7687 --env=NEO4J_AUTH=none neo4j:latest
```

At last you need to provide the credentials for Neo4j in your .env file, which could
look like this:
```
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=neo4j
```

All your GraphQL queries and mutations will be directed to this Database.

### Compiles and hot-reloads for development
```
npm run dev
```

### Run tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
