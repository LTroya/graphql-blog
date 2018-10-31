import {extractFragmentReplacements} from 'prisma-binding'
import Comment from './Comment';
import Post from './Post';
import User from './User';
import Mutation from './Mutation';
import Query from './Query';
import Subscription from './Subscription';

const resolvers = {
    Comment,
    Post,
    User,
    Mutation,
    Query,
    Subscription
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export {resolvers, fragmentReplacements};