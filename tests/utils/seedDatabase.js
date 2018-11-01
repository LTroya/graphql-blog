import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {prisma} from "../../src/prisma";

const userOne = {
    input: {
        name: "Luis",
        email: "troyaluis56@gmail.com",
        password: "password"
    },
    user: undefined,
    jwt: undefined
};

const userTwo = {
    input: {
        name: 'Francisco',
        email: 'f@example.com',
        password: 'password'
    },
    user: undefined,
    jwt: undefined
};

const postOne = {
    input: {
        title: 'Graphql testing for fun',
        body: '....',
        published: false
    },
    post: undefined
};

const postTwo = {
    input: {
        title: 'Some title',
        body: '...',
        published: true
    },
    post: undefined
};

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyComments();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // Create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET);

    // Create user two
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    });
    userTwo.jwt = jwt.sign({userId: userTwo.user.id}, process.env.JWT_SECRET);

    // Create post one
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });
    await prisma.mutation.createPost({
        data: {
            title: 'Using jest for tests',
            body: '....',
            published: true,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });
    postTwo.post = await prisma.mutation.createPost({
       data: {
           ...postTwo.input,
           author: {
               connect: {
                   id: userTwo.user.id
               }
           }
       }
    });
};

export {seedDatabase, userOne, userTwo, postOne, postTwo};