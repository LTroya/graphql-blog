import 'cross-fetch/polyfill';
import {prisma} from "../src/prisma";
import {seedDatabase, userOne, postOne} from "./utils/seedDatabase";
import {getClient} from "./utils/getClient";
import {getPosts, getMyPosts, updatePost, createPost, deletePost} from '../src/utils/operations';

const client = getClient();

beforeAll(() => jest.setTimeout(300000));
beforeEach(seedDatabase);

test('Should only expose published posts', async () => {
    const response = await client.query({query: getPosts});
    const onlyPublished = response.data.posts.every(post => post.published);
    expect(onlyPublished).toBe(true);
});

test('Should get all the posts for the authenticated user', async () => {
    const client = getClient(userOne.jwt);
    const {data} = await client.query({query: getMyPosts});
    expect(data.myPosts.length).toBe(2);
});

test('Should be able to update own post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        data: {
            published: true
        },
        id: postOne.post.id
    };
    const {data} = await client.mutate({
        mutation: updatePost,
        variables
    });
    const exists = await prisma.exists.Post({id: postOne.post.id, published: true});

    expect(data.updatePost.published).toBe(true);
    expect(exists).toBe(true);
});

test('Should be able to create posts', async () => {
    const client = getClient(userOne.jwt);
    const title = 'My new incredible post';
    const variables = {
        data: {
            title,
            body: "Some body...",
            published: false
        }
    };
    const {data} = await client.mutate({
        mutation: createPost,
        variables
    });
    const exists = await prisma.exists.Post({id: data.createPost.id});
    const posts = await prisma.query.posts({
        where: {
            author: {
                id: userOne.user.id
            }
        }
    });
    expect(data.createPost.title).toBe(title);
    expect(posts.length).toBe(3);
    expect(exists).toBe(true);
});

test('Should be able to delete own post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: postOne.post.id
    };
    await client.mutate({
        mutation: deletePost,
        variables
    });
    const exists = await prisma.exists.Post({id: postOne.post.id});
    expect(exists).toBe(false);
});