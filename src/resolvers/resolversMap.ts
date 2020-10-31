import { IResolvers } from 'graphql-tools';
import mutation from './mutation';
// import mutation from './mutation';
import query from './query';
import subscription from './subscription';
import type from './type';

export const LIST: string [] = [ ];
const resolvers : IResolvers = {
    ...query,
    ...mutation,
    ...type,
    ...subscription
};

export default resolvers;