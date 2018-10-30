import {Prisma} from 'prisma-binding';
import {fragmentReplacements} from "./resolvers";

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'SUPER_SECRET_VALUE',
    fragmentReplacements
});

export {prisma};