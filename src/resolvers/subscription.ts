import { CHANGE_VOTES } from './../config/constants';
import { IResolvers } from 'graphql-tools';

const subscription: IResolvers = {
  Subscription: {
    changeVotes: {
      subscribe: (_: any, __: any, { pubsub }) => {
        return pubsub.asyncIterator(CHANGE_VOTES);
      },
    },
  },
};

export default subscription;
