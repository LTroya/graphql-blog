import 'cross-fetch/polyfill';
import {gql} from 'apollo-boost';
import {prisma} from "../src/prisma";
import {seedDatabase, userOne, postTwo} from "./utils/seedDatabase";
import {getClient} from "./utils/getClient";

const client = getClient();

beforeAll(() => jest.setTimeout(30000));
beforeEach(seedDatabase);

test('Should be able to create comment in any post', async () => {
    const client = getClient(userOne.jwt);
    const createComment = gql`
        mutation {
            createComment(
                data: {
                    text: "Amazing comment",
                    post: "${postTwo.post.id}"
                }
            ) {
                text
                id
            }
        }
    `;
    const {data} = await client.mutate({mutation: createComment});
    const exists = await prisma.exists.Comment({
        id: data.createComment.id,
        post: {
            id: postTwo.post.id
        }
    });
    expect(exists).toBe(true);
});