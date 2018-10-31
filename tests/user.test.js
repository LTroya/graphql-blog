import 'cross-fetch/polyfill';
import {gql} from 'apollo-boost';
import {prisma} from "../src/prisma";
import {seedDatabase, userOne} from "./utils/seedDatabase";
import {getClient} from "./utils/getClient";

const client = getClient();

beforeAll(() => jest.setTimeout(30000));
beforeEach(seedDatabase);

const createUser = gql`
    mutation($data: CreateUserInput!) {
        createUser(
            data: $data
        ) {
            token,
            user {
                id
                name
                email
            }
        }
    }
`;

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`;

const login = gql`
    mutation($data: LoginPostPayload) {
        login (
            data: $data
        ) {
            token
        }
    }
`;

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Luis",
            email: "l2@example.com",
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
    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
});

test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: "troyaluis56@gmail.com",
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
    const getProfile = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `;
    const {data} = await client.query({query: getProfile});
    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
});