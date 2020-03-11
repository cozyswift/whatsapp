import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server-express';
import schema from '../../schema';

describe('Queryc.chats 테스트', () => {
  it('세부적인 채팅을 추적해야 함', async () => {
    const server: any = new ApolloServer({ schema });
    //1. GraphqQL 서버만들기

    const { query } = createTestClient(server);
    //아폴로 클라이언트 설정

    const res = await query({
      variables: { chatId: '1' },
      query: gql`
        query GetChat($chatId: ID!) {
          chat(chatId: $chatId) {
            id
            name
            picture
            lastMessage {
              id
              content
              createdAt
            }
          }
        }
      `,
    });

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot();
  });
});
