import 'cross-fetch/polyfill';
import {prisma} from "../src/prisma";
import {seedDatabase, userOne} from "./utils/seedDatabase";
import {getClient} from "./utils/getClient";
import {getUsers, getProfile, createUser, login} from "../src/utils/operations";

const client = getClient();

beforeAll(() => jest.setTimeout(300000));
beforeEach(seedDatabase);

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Luis",
            email: "l@example.com",
            password: "password"
        }
    };

    const response = await client.mutate({
        mutation: createUser,
        variables
    });
    const exists = await prisma.exists.User({id: response.data.createUser.user.id});
    expect(exists).toBe(true);
});

test('Should expose public author profiles', async () => {
    const response = await client.query({query: getUsers});
    const noEmails = response.data.users.every(user => !user.email);
    expect(noEmails).toBe(true);
});

test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: userOne.input.email,
            password: "incorrect_password"
        }
    };

    expect(
        client.mutate({
            mutation: login,
            variables
        })
    ).rejects.toThrow();
});

test('Should not create an user with invalid password', async () => {
    const variables = {
        data: {
            name: "Jen",
            email: "j@example.com",
            password: "123456"
        }
    };

    expect(
        client.mutate({
            mutation: createUser,
            variables
        })
    ).rejects.toThrow();
});

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt);
    const {data} = await client.query({query: getProfile});
    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
});