import { COLLECTIONS } from './../config/constants';
//Lista de personajes
export async function getCharacters(db: any) {
  return await db
    .collection(COLLECTIONS.CHARACTERS)
    .find()
    .sort({ id: 1 })
    .toArray();
}
//Personaje seleccionado
export async function getCharacter(db: any, id: string) {
  return await db.collection(COLLECTIONS.CHARACTERS).findOne({ id });
}
//voto seleccionado
export async function getVote(db: any, id: string) {
    return await db.collection(COLLECTIONS.VOTES).findOne({ id });
  }
//Votos de un personaje
export async function getCharacterVotes(db: any, id: string) {
  return await db.collection(COLLECTIONS.VOTES).find({ character: id }).count();
}
//obtener ide del nuevo voto
export async function asignVoteId(db: any) {
  const lastVotes = await db
    .collection(COLLECTIONS.VOTES)
    .find()
    .sort({ _id: -1 }).limit(1).toArray();
    if (lastVotes.length===0) {
        return "1";
    }
    return String(+lastVotes[0].id+1);
}
