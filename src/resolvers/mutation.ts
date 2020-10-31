import { COLLECTIONS, CHANGE_VOTES } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import {
  asignVoteId,
  getCharacter,
  getCharacters,
  getVote,
} from '../lib/database-operations';
import { Datetime } from '../lib/datetime';
async function response(status: boolean, message: string, db: any) {
  return {
    status,
    message,
    characters: await getCharacters(db),
  };
}
async function sendNotification(pubsub: any, db: any) {
  pubsub.publish(CHANGE_VOTES, { changeVotes: await getCharacters(db) });
}
const mutation: IResolvers = {
  Mutation: {
    async addVote(_: void, { character }, { pubsub, db }) {
      //Comprobar que existe
      const selectCharacter = await getCharacter(db, character);
      if (selectCharacter === null || selectCharacter === undefined) {
        return response(
          false,
          'El personaje no existe y no se puede votar',
          db
        );
      }

      //Obtenemos el id del voto
      const vote = {
        id: await asignVoteId(db),
        character,
        createdAt: new Datetime().getCurrentDateTime('/'),
      };
      return await db
        .collection(COLLECTIONS.VOTES)
        .insertOne(vote)
        .then(async () => {
          sendNotification(pubsub, db);
          return response(true, 'Se ha emitido correctamente el voto', db);
        })
        .catch(async () => {
          return response(false, 'No se ha emitido correctamente el voto', db);
        });
    },
    async updateVote(_: void, { id, character }, { pubsub, db }) {
      //Comprobar que existe
      const selectCharacter = await getCharacter(db, character);
      if (selectCharacter === null || selectCharacter === undefined) {
        return response(false, 'El personaje no existe', db);
      }
      //comprobar que el voto exites
      const selectVote = await getVote(db, id);
      if (selectVote === null || selectVote === undefined) {
        return response(false, 'El voto no existe', db);
      }
      return await db
        .collection(COLLECTIONS.VOTES)
        .updateOne(
          {
            id,
          },
          { $set: { character } }
        )
        .then(async () => {
          sendNotification(pubsub, db);
          return response(true, 'El voto se emitió correctamente', db);
        })
        .catch(async () => {
          return response(false, 'El voto no se emitió correctamente', db);
        });
    },
    async deleteVote(_: void, { id }, { pubsub, db }) {
      //existe?
      const selectVote = await getVote(db, id);
      if (selectVote === null || selectVote === undefined) {
        return response(
          false,
          'El voto no existe, no se borró correctamente',
          db
        );
      }
      //borrar
      return await db
        .collection(COLLECTIONS.VOTES)
        .deleteOne({ id })
        .then(async () => {
          sendNotification(pubsub, db);
          return response(true, 'El voto se borró correctamente', db);
        })
        .catch(async () => {
          return response(false, 'El voto no se borró correctamente', db);
        });
    },
  },
};

export default mutation;
