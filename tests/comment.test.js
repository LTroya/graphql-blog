import 'cross-fetch/polyfill';
import {gql} from 'apollo-boost';
import {prisma} from "../src/prisma";
import {seedDatabase, userOne, postTwo, commentOne, commentTwo} from "./utils/seedDatabase";
import {getClient} from "./utils/getClient";
import {deleteComment, createComment, updateComment, subscribeToComments} from "../src/utils/operations";

const client = getClient();

beforeAll(() => jest.setTimeout(30000));
beforeEach(seedDatabase);

test('Should be able to create comment in any post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        data: {
            text: "Amazing comment",
            post: postTwo.post.id
        }
    };
    const {data} = await client.mutate({
        mutation: createComment,
        variables
    });
    const exists = await prisma.exists.Comment({
        id: data.createComment.id,
        post: {
            id: postTwo.post.id
        }
    });
    expect(exists).toBe(true);
});

test('Should be able to update own comment', async () => {
    const client = getClient(userOne.jwt);
    const text = 'Updated comment';
    const variables = {
        data: {
            text
        },
        id: commentOne.comment.id
    };
    const {data} = await client.mutate({
        mutation: updateComment,
        variables
    });
    expect(data.updateComment.text).toBe(text);
});

test('Should not be able to update other user comment', async () => {
    const client = getClient(userOne.jwt);
    const text = 'Updated comment';
    const variables = {
        data: {
            text
        },
        id: commentTwo.comment.id
    };
    expect(client.mutate({
        mutation: updateComment,
        variables
    })).rejects.toThrow();
});

test('Should be able to delete own comment', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: commentOne.comment.id
    };
    await client.mutate({
        mutation: deleteComment,
        variables
    });
    const exists = await prisma.exists.Comment({
        id: commentOne.comment.id,
        post: {
            id: postTwo.post.id
        }
    });
    expect(exists).toBe(false);
});

test('Should not be able to delete other user\'s comment', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: commentTwo.comment.id
    };
    expect(client.mutate({
        mutation: deleteComment,
        variables
    })).rejects.toThrow();
});

// TODO: This is not working. "iterator.next" is not a function
test.skip('Should subscribe to comments for a post', async (done) => {
    const client = getClient(userOne.jwt);
    const variables = {
        postId: postTwo.post.id
    };
    client.subscribe({query: subscribeToComments, variables}).subscribe({
        next(response) {
            expect(response.data.comment.mutation).toBe('DELETED');
            done();
        }
    });

    await prisma.mutation.deleteComment({where: {id: commentOne.comment.id}})
});