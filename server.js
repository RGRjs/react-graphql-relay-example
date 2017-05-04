import fs from 'fs';
import express from 'express';
import Schema from './data/schema';
import GraphQLHTTP from 'express-graphql';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';

import {MongoClient} from 'mongodb';

let app = express();
app.use(express.static('public'));

(async () => {
  try {
    let db = await MongoClient.connect(process.env.MONGODB_URI);
    let schema = Schema(db);

    app.use('/graphql', GraphQLHTTP({
      schema,
      graphiql: true
    }));

    let server = app.listen(process.env.PORT || 3000, () => {
      console.log(`Listening on port ${server.address().port}`);
    });

    // Generate schema.json
    let json = await graphql(schema, introspectionQuery);
    fs.writeFile('./data/schema.json', JSON.stringify(json, null, 2), err => {
      if (err) throw err;

      console.log("JSON schema created");
    });
  } catch(e) {
    console.log(e);
  }
})();
