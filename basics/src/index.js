import {GraphQLServer} from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

let users = [
    {id: '4', name: 'Marihec', email: 'mpinto@gmail.com', age: 25},
    {id: '1', name: 'Kelly', email: 'kmaestre@gmail.com', age: 25},
    {id: '2', name: 'Daniella', email: 'daniella@gmail.com', age: 23},
    {id: '3', name: 'Luis', email: 'luis@gmail.com', age: null},
];

let posts = [
    {id: '1', title: 'Subida al cerro San cristobal', body: 'Compromiso para los fines de semana', published: false, author: '1'},
    {id: '2', title: 'Compra del switch mas juegos', body: 'Espero que este a 200.000 mil pesos', published: false, author: '4'},
    {id: '3', title: 'Ir a trabajar y seleccionar el dia libre que necesito', body: 'Lo mas probable es que sea el viernes para morir jugando', published: false, author: '4'},
];

let comments = [
    {id: '1', text: 'This is my first comment in this page', author: '1', post: '1'},
    {id: '2', text: 'I want the switch, right now!', author: '2', post: '1'},
    {id: '3', text: 'The first game I will buy will be Mario Odyssey!', author: '2', post: '3'},
    {id: '4', text: 'My second game will be Xenoblade 2, others are just optionals!', author: '3', post: '3'}
];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
    }
    
    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }
    
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }
    
    input CreatePostInput {
        title: String!
        body: String! 
        published: Boolean! 
        author: ID!
    }
    
    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }
    
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    
    type User { 
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
`;

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }

            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        me() {
            return {
                id: '1234',
                name: 'Luis Troya',
                email: 'troyaluis56@gmail.com',
                age: 26
            }
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }
            return comments.filter(comment => comment.text.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }

            return posts.filter(
                post => post.title.toLowerCase().includes(args.query.toLowerCase())
                    || post.body.toLowerCase().includes(args.query.toLowerCase())
            );
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email.toLowerCase() === args.data.email.toLowerCase());
            if (emailTaken) {
                throw new Error(`Email ${args.data.email} is taken.`);
            }
            const user = {
                id: uuidv4(),
                ...args.data
            };
            users.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.id);
            if (!~userIndex) throw new Error(`User ${args.id} not found`);
            const deletedUser = users.splice(userIndex, 1)[0];
            posts = posts.filter(post => {
                const match = post.author === deletedUser.id;
                if (match) {
                    comments = comments.filter(comment => comment.post !== post.id);
                }
                return !match;
            });
            comments = comments.filter(comment => comment.author !== deletedUser.id);
            return deletedUser;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.find(user => user.id === args.data.author);
            if (!userExists) {
                throw new Error(`User ${args.data.author} not found`);
            }
            const post = {
                id: uuidv4(),
                ...args.data
            };
            posts.push(post);
            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex(post => post.id === args.id);
            if (!~postIndex) throw new Error(`Post ${args.id} does not exist`);
            const post = posts.splice(postIndex, 1)[0];
            comments = comments.filter(comment => comment.post !== post.id);
            return post;
        },
        createComment(parent, args, ctx, info) {
            const authorExists = users.find(user => user.id === args.data.author);
            const postExists = posts.find(p => p.id === args.data.post);
            if (!authorExists) throw new Error(`User ${args.data.author} does not exist`);
            if (!postExists) throw new Error(`Post ${args.data.post} does not exist`);
            const comment = {
                id: uuidv4(),
                ...args.data
            };
            comments.push(comment);
            return comment;
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment => comment.id === args.id);
            if (!~commentIndex) throw new Error(`Comment ${args.id} does not exist`);
            return comments.splice(commentIndex, 1)[0];
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => parent.author === user.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post)
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('Server is up on localhost:4000!');
});