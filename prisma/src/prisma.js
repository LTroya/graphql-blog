import {Prisma} from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
});

// prisma.query.users(null, '{ id name email posts {id title}}').then(data => {
//    console.log(data);
// });
//
// prisma.query.comments(null, '{id text author {id name}}').then(data => {
//     console.log(data);
// });

const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({id: authorId});

    if (!userExists) throw new Error(`User ${authorId} not found!`);

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{id title body published author {id name}}');

    return await prisma.query.user({
        where: {
            id: authorId
        }
    }, '{id name email posts {id title published }}');
};

const updatePostForUser = async (postId, data) => {
    const postExists = prisma.exists.Post({id: postId});

    if (!postExists) throw new Error(`Post ${postId} not found`);

    const {author} = await prisma.mutation.updatePost({
        data,
        where: {
            id: postId
        }
    }, '{author {id name email}}');
    return author;
};

// updatePostForUser('cjndn13tj00220851tgs03uhz', {
//     title: 'Updated prisma post'
// }).then(user => {
//     console.log(user)
// }).catch(err => console.error(err));
//
// createPostForUser('cjndmqdh900190851ot7lobgi', {
//     title: 'Hello graphQL',
//     body: 'Hello body',
//     published: true
// }).then(user => {
//     console.log(user);
// }).catch(error => console.error(error));


// const post = prisma.mutation.updatePost({
//     data: {
//         body: 'Body with new updates',
//         published: false
//     },
//     where: {
//         id: 'cjngee93v001d0853knn8vtli'
//     }
// }, '{id title body published}').then(data => console.log('Data', data));