import uuidv4 from "uuid/v4";

export default {
    async createUser(parent, args, {prisma}, info) {
        const emailTaken = await prisma.exists.User({email: args.data.email});
        if (emailTaken) {
            throw new Error(`Email ${args.data.email} is taken.`);
        }
        return prisma.mutation.createUser({data: args.data}, info);
    },
    async deleteUser(parent, args, {prisma}, info) {
        const userExists = await prisma.exists.User({email: args.id});
        if (!userExists) {
            throw new Error(`User ${args.id} not found`);
        }
        return prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info);
    },
    async updateUser(parent, args, {prisma}, info) {
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
    deletePost(parent, args, {prisma, pubsub}, info) {
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info);
    },
    updatePost(parent, args, {prisma, pubsub}, info) {
        const postExists = prisma.exists.Post({id: args.id});
        if (!postExists) {
            throw new Error(`Post ${args.id} does not exist`);
        }
        return prisma.mutation.updatePost({
            data: args.data,
            where: {
                id: args.id
            }
        }, info);
        // pubsub.publish('post', {
        //     post: {
        //         data: post,
        //         mutation: 'UPDATED'
        //     }
        // });
    },
    createComment(parent, args, {prisma}, info) {
        return prisma.mutation.createComment({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    deleteComment(parent, args, {prisma}, info) {
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    updateComment(parent, args, {pubsub}, info) {
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    }
}