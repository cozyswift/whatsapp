import gql from "graphql-tag";
import React from "react";
import { useCallback, useState, useMemo } from "react";
import { useApolloClient, useQuery, useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import ChatNavbar from "./ChatNavbar";
import MessageInput from "./MessageInput";
import { History } from "history";
import ChatNavBar from "./ChatNavbar";
import MessagesList from "./MeggagesList";
import * as queries from '../../graphql/queries';

const Container = styled.div`
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`;
const addMessageMutation = gql`
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      id
      content
      createdAt
    }
  }
`;

const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      name
      picture
      messages {
        id
        content
        createdAt
      }
    }
  }
`;
// path의 경로의 따라 match의 params 값이 바뀐다.
// 쿼리의 변수값은 match의 파람의 변수이름이 동일해야 값을 가져온다
//왜냐하면 resovler에 현재 chistId변수이름 이 기록 되어있기 때문이다

interface ChatRoomScreenParams {
  chatId: string;
  match: any;
  history: History;
}

export interface ChatQueryMessage {
  id: string;
  content: string;
  createdAt: Date;
}

export interface ChatQueryResult {
  id: string;
  name: string;
  picture: string;
  messages: Array<ChatQueryMessage>;
}
type OptionalChatQueryResult = ChatQueryResult | null;

interface ChatsResult {
  chats: any[];
}

function ChatRoomScreen({ chatId, match, history }: ChatRoomScreenParams) {
  // const [chat, setChat] = useState<OptionalChatQueryResult>(null);

  // useMemo(async () => {
  //   const body = await fetch(`http://localhost:4000/graphql`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       query: getChatQuery,
  //       variables: { chatId }
  //     })
  //   });

  //   const rawData = await body.json();
  //   const {
  //     data: { chat }
  //   } = rawData;

  //   setChat(chat);
  // }, [chatId]);
  //[chatId]의 값이 바뀌면 새로 계산한다.

  const client = useApolloClient();
  const { data, error, loading } = useQuery<any>(getChatQuery, {
    variables: { chatId }
  });

  const chat = data && data.chat; //유효성 검사 부분 없으면 에러남
  const [addMessage] = useMutation(addMessageMutation);

  console.log({ chat });
  // const onSendMessage = useCallback(
  //   (content: string) => {
  //     if (!chat) return null;

  //     const message = {
  //       id: (chat.messages.length + 10).toString(),
  //       createdAt: new Date(),
  //       content,
  //       __typename: "Chat"
  //     };

  //     client.writeQuery({
  //       query: getChatQuery,
  //       variables: { chatId },
  //       data: {
  //         chat: {
  //           ...chat,
  //           messages: chat.messages.concat(message)
  //         }
  //       }
  //     });
  //   },
  //   [chat, chatId, client]
  //   //chat, chatId, client가 바꼈을 때 함수 새로 생성
  // );


  const onSendMessage = useCallback(
    (content: string) => {
      addMessage({
        variables: { chatId, content },
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'Message',
            id: Math.random()
              .toString(36)
              .substr(2, 9),
            createdAt: new Date(),
            content,
          },
        },

        update: (client, { data }) => {
          if (data && data.addMessage) {
            client.writeQuery({
              query: getChatQuery,
              variables: { chatId },
              data: {
                chat: {
                  ...chat,
                  messages: chat.messages.concat(data.addMessage),
                },
              },
            });
          }


          let clientChatsData;
          try {
            clientChatsData = client.readQuery<ChatsResult>({
              query: queries.chats,
            });
          } catch (e) {
            return;
          }

          if (!clientChatsData || clientChatsData === null) {
            return null;
          }
          if (!clientChatsData.chats || clientChatsData.chats === undefined) {
            return null;
          }
          const chats = clientChatsData.chats;

          const chatIndex = chats.findIndex((currentChat: any) => currentChat.id === chatId);
          if (chatIndex === -1) return;
          const chatWhereAdded = chats[chatIndex];

          chatWhereAdded.lastMessage = data.addMessage;
          // The chat will appear at the top of the ChatsList component
          chats.splice(chatIndex, 1);
          chats.unshift(chatWhereAdded);

          client.writeQuery({
            query: queries.chats,
            data: { chats: chats },
          });
        },
      });
    },
    [chat, chatId, addMessage]
  );


  if (!chat) return null;

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류 :(</p>;

  return (
    <Container>
      <ChatNavbar chat={chat} history={history} />
      {chat.messages && <MessagesList messages={chat.messages} />}
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  );
}

export default ChatRoomScreen;
