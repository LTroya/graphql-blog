import {GraphQLServer, PubSub} from 'graphql-yoga';
import db from './db';
import {Query, Mutation, Post, User, Comment, Subscription} from "./resolvers";

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Post,
        User,
        Mutation,
        Comment,
        Subscription
    },
    context: {
        db,
        pubsub
    }
});

server.start(() => {
    console.log('Server is up on localhost:4000!');
});