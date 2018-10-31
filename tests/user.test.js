import 'cross-fetch/polyfill';
import {gql} from 'apollo-boost';
import {prisma} from "../src/prisma";
import {seedDatabase, userOne} from "./utils/seedDatabase";
import {getClient} from "./utils/getClient";

const client = getClient();

beforeAll(() => jest.setTimeout(30000));
beforeEach(seedDatabase);

test.skip('Should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name: "Luis"
                    email: "troyaluis56@gmail.com"
                    password: "password"
                }
            ) {
                token,
                user {
                    id
                    name
                }
            }
        }
   `;

    const response = await client.mutate({
        mutation: createUser
    });
    const exists = await prisma.exists.User({id: response.data.createUser.user.id});
    expect(exists).toBe(true);
});

test.skip('Should expose public author profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `;
    const response = await client.query({query: getUsers});
    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
});

test.skip('Should not login with bad credentials', async () => {
    const login = gql`
        mutation {
            login (
                data: {
                    email: "l@example.com"
                    password: "incorrect_password"
                }
            ) {
                token
            }
        }
    `;
    expect(
        client.mutate({mutation: login})
    ).rejects.toThrow();
});

test.skip('Should not create an user with invalid password', async () => {
    const createUser = gql`
        mutation {
            createUser (
                data: {
                    name: "Jen"
                    email: "jen@example.com"
                    password: "123456"
                }
            ) {
                token
            }
        }
    `;
    expect(
        client.mutate({mutation: createUser})
    ).rejects.toThrow();
});

test.skip('Should fetch user profile', async () => {
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