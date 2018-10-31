import ApolloBoost, {gql} from 'apollo-boost';

const client = new ApolloBoost({
   uri: 'http://localhost:4000'
});

const getUsers = gql`
    query { 
        users {
            id
            name
        }
    }
`;

const getPosts = gql(`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`);

const toTemplate = (data, key) => {
      return data.reduce((html, item) => {
        return html.concat(`<div>
            <h3>${item[key]}</h3>
        </div>`);
    }, []);
};

client.query({
    query: getUsers
}).then((response) => {
    const html = toTemplate(response.data.users, 'name');
    document.getElementById('users').innerHTML = html.join('');
});

client.query({
    query: getPosts
}).then((response) => {
    const html = toTemplate(response.data.posts, 'title');
    document.getElementById('posts').innerHTML = html.join('');
});