import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';

export default {
    async login(parent, args, {prisma}, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        });
        if (!user) {
            throw new Error('User doesn\'t exist');
        }
        const isMatch = await bcrypt.compare(args.data.password, user.password);
        if (!isMatch) {
            throw new Error('Email or password are incorrect');
        }
        return {
            user,
            token: jwt.sign({userId: user.id}, 'MY_SECRET_VALUE')
        }
    },
    async createUser(parent, args, {prisma}, info) {
        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 character or longer.');
        }
        const password = await bcrypt.hash(args.data.password, 10);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        }); // Without info, it will return only scalar fields

        return {
            user,
            token: jwt.sign({userId: user.id}, 'MY_SECRET_VALUE')
        }
    },
    async deleteUser(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info);
    },
    async updateUser(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info);
    },
    async createPost(parent, args, {prisma, pubsub, request}, info) {
        const userId = getUserId(request);
        const post = await prisma.mutation.createPost({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: userId
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
    async deletePost(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
           id: args.id,
           author: {
               id: userId
           }
        });
        if (!postExists) throw new Error('Unable to delete post');
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info);
    },
    async updatePost(parent, args, {prisma, pubsub, request}, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });
        const isPublished = prisma.exists.Post({id: args.id});
        if (!postExists) {
            throw new Error(`Unable to update post`);
        }
        if (isPublished && !args.data.published) {
            console.log(await prisma.mutation.deleteManyComments({
                where: {
                    post: {id: args.id}
                }
            }));
        }
        return prisma.mutation.updatePost({
            data: args.data,
            where: {
                id: args.id
            }
        }, info);
    },
    async createComment(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        });
        if (!postExists) throw new Error('Unable to find post');
        return prisma.mutation.createComment({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: userId
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
    async deleteComment(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!commentExists) throw new Error('Unable to delete comment');
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, {prisma, request}, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!commentExists) throw new Error('Unable to update comment');
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info);
    }
}