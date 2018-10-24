import uuidv4 from "uuid/v4";

export default {
    async createUser(parent, args, {db, prisma}, info) {
        const emailTaken = await prisma.exists.User({email: args.data.email});
        if (emailTaken) {
            throw new Error(`Email ${args.data.email} is taken.`);
        }
        return prisma.mutation.createUser({data: args.data}, info);
    },
    async deleteUser(parent, args, {db, prisma}, info) {
        const userExists = await prisma.exists.User({email: args.id});
        if (!~userIndex) {
            throw new Error(`User ${args.id} not found`);
        }
        return prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info);
    },
    async updateUser(parent, args, {db, prisma}, info) {
        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    },
    async createPost(parent, args, {prisma, pubsub}, info) {
        const userExists = await prisma.exists.User({id: args.data.author});
        if (!userExists) {
            throw new Error(`User ${args.data.author} not found`);
        }
        const post = await prisma.mutation.createPost({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            }
        }, info);

        // pubsub.publish('post', {
        //     post: {
        //         data: post,
        //         mutation: 'CREATED'
        //     }
        // });
        return post;
    },
    deletePost(parent, args, {db, pubsub}, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id);
        if (!~postIndex) throw new Error(`Post ${args.id} does not exist`);
        const post = db.posts.splice(postIndex, 1)[0];
        db.comments = db.comments.filter(comment => comment.post !== post.id);
        pubsub.publish('post', {
            post: {
                mutation: 'DELETED',
                data: post
            }
        });
        return post;
    },
    updatePost(parent, args, {db, pubsub}, info) {
        const {id, data} = args;
        const post = db.posts.find(post => post.id === id);
        if (!post) throw new Error(`Post ${args.post} not found`);

        post.title = data.title || post.title;
        post.body = data.body || post.body;
        post.published = data.published || post.published;

        pubsub.publish('post', {
            post: {
                data: post,
                mutation: 'UPDATED'
            }
        });

        return post;
    },
    createComment(parent, args, {db, pubsub}, info) {
        const authorExists = db.users.find(user => user.id === args.data.author);
        const postExists = db.posts.find(p => p.id === args.data.post);
        if (!authorExists) throw new Error(`User ${args.data.author} does not exist`);
        if (!postExists) throw new Error(`Post ${args.data.post} does not exist`);
        const comment = {
            id: uuidv4(),
            ...args.data
        };
        db.comments.push(comment);
        pubsub.publish(`comment:${args.data.post}`, {
            comment: {
                data: comment,
                mutation: 'CREATED'
            }
        });
        return comment;
    },
    deleteComment(parent, args, {db, pubsub}, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
        if (!~commentIndex) throw new Error(`Comment ${args.id} does not exist`);
        const comment = db.comments.splice(commentIndex, 1)[0];
        pubsub.publish(`comment:${comment.post}`, {
            comment: {
                data: comment,
                mutation: 'DELETED'
            }
        });
        return comment;
    },
    updateComment(parent, args, {db, pubsub}, info) {
        const {id, data} = args;
        const comment = db.comments.find(comment => comment.id === id);
        if (!comment) throw new Error(`Comment ${id} not found!`);
        comment.text = data.text || comment.text;
        pubsub.publish(`comment:${comment.post}`, {
            comment: {
                data: comment,
                mutation: 'UPDATED'
            }
        });
        return comment;
    }
}