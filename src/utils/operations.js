import {gql} from 'apollo-boost';
import {commentOne} from "../../tests/utils/seedDatabase";

const createUser = gql`
    mutation($data: CreateUserInput!) {
        createUser(
            data: $data
        ) {
            token,
            user {
                id
                name
                email
            }
        }
    }
`;

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`;

const login = gql`
    mutation($data: LoginUserInput!) {
        login (
            data: $data
        ) {
            token
        }
    }
`;

const getProfile = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;

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

const getMyPosts = gql`
    query {
        myPosts {
            id
            title
            body
            published
            author {
                name
                id
            }
        }
    }
`;

const updatePost = gql`
    mutation($data: UpdatePostInput!, $id: ID!) {
        updatePost(
            id: $id
            data: $data
        ) {
            id
            title
            body
            published
        }
    }    
`;

const createPost = gql`
    mutation($data: CreatePostInput!) {
        createPost(
            data: $data
        ) {
            id
            title
            body
            published
        }
    }
`;

const deletePost = gql`
    mutation($id: ID!) {
        deletePost(
            id: $id
        ) {
            id
        }
    }
`;

const createComment = gql`
    mutation($data: CreateCommentInput!) {
        createComment(
            data: $data
        ) {
            text
            id
        }
    }
`;

const deleteComment = gql`
    mutation($id: ID!) {
        deleteComment(
            id: $id
        ) {
            id
        }
    }
 `;

const updateComment = gql`
    mutation($id: ID!, $data: UpdateCommentInput) {
        updateComment(
            data: $data,
            id: $id
        ){
            id
            text
        }
    }
`;

const subscribeToComments = gql`
    subscription($postId: ID!) {
        comment(postId: $postId) {
            mutation
            node {
                id
                text
            }
        }
    }
`;

const subscribeToPosts = gql`
    subscription {
        post {
            mutation
        }
    }
`;

export {
    createUser,
    getUsers,
    login,
    getProfile,
    getPosts,
    getMyPosts,
    updatePost,
    createPost,
    deletePost,
    createComment,
    updateComment,
    deleteComment,
    subscribeToComments,
    subscribeToPosts
}