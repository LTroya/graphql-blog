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

const postOne = {
    input: {
        title: 'Graphql testing for fun',
        body: '....',
        published: false
    },
    post: undefined
};

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // Create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET);

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
    })
};

export {seedDatabase, userOne, postOne};