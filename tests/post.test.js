import 'cross-fetch/polyfill';
import {gql} from 'apollo-boost';
import {prisma} from "../src/prisma";
import {seedDatabase, userOne, postOne} from "./utils/seedDatabase";
import {getClient} from "./utils/getClient";

const client = getClient();

beforeAll(() => jest.setTimeout(30000));
beforeEach(seedDatabase);

test.skip('Should only expose published posts', async () => {
    const getPosts = gql`
        query {
            posts {
                id
                title
                published
                body
            }
            
        }
   `;
    const response = await client.query({query: getPosts});
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test.skip('Should get all the posts for the authenticated user', async () => {
    const client = getClient(userOne.jwt);
    const getMyPosts = gql`
        query {
            myPosts {
                id
                title
                body
                published
            }
        }
    `;
    const {data} = await client.query({query: getMyPosts});
    expect(data.myPosts.length).toBe(2);
});

test.skip('Should be able to update own post', async () => {
   const client = getClient(userOne.jwt);
   const updatePost = gql`
        mutation {
            updatePost(
                id: "${postOne.post.id}"
                data: {
                    published: true
                }
            ) {
                id
                title
                body
                published
            }
        }    
   `;
    const {data} = await client.mutate({mutation: updatePost});
    const exists = await prisma.exists.Post({id: postOne.post.id, published: true});

    expect(data.updatePost.published).toBe(true);
    expect(exists).toBe(true);
});

test('Should be able to create posts', async () => {
    const client = getClient(userOne.jwt);
    const title = 'My new incredible post';
    const createPost = gql`
        mutation {
            createPost(
                data: {
                    title: "${title}"
                    body: "Some body..."
                    published: false
                }
            ) {
                id
                title
                body
                published
            }
        }
    `;
    const {data} = await client.mutate({mutation: createPost});
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

test.skip('Should be able to delete own post', async () => {
    const client = getClient(userOne.jwt);
    const deletePost = gql`
        mutation {
            deletePost(
                id: "${postOne.post.id}"
            ) {
                id
            }
        }
    `;
    await client.mutate({mutation: deletePost});
    const exists = await prisma.exists.Post({id: postOne.post.id});
    expect(exists).toBe(false);
});