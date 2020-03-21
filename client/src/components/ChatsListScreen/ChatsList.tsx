import React from "react";
import moment from "moment";
import { List, ListItem } from "@material-ui/core";
import styled from "styled-components";
import { useCallback } from "react";
import { History } from "history";
import { useChatsQuery } from '../../graphql/types';

const Container = styled.div`
  height: calc(100% - 56px);
  overflow-y: overlay;
`;
const StyledList = styled(List)`
  padding: 0 !important;
`;
const StyledListItem = styled(ListItem)`
  height: 76px;
  padding: 0 15px;
  display: flex;
`;
const ChatPicture = styled.img`
  height: 50px;
  width: 50px;
  object-fit: cover;
  border-radius: 50%;
`;
const ChatInfo = styled.div`
  width: calc(100% - 60px);
  height: 46px;
  padding: 15px 0;
  margin-left: 10px;
  border-bottom: 0.5px solid silver;
  position: relative;
`;
const ChatName = styled.div`
  margin-top: 5px;
`;
const MessageContent = styled.div`
  color: gray;
  font-size: 15px;
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
const MessageDate = styled.div`
  position: absolute;
  color: gray;
  top: 20px;
  right: 0;
  font-size: 13px;
`;

// export const getChatsQuery = gql`
//   query GetChats {
//     chats {
//       id
//       name
//       picture
//       lastMessage {
//         id
//         content
//         createdAt
//       }
//     }
//   }
// `;

interface ChatsListProps {
  history: History;
}

function ChatsList({ history }: ChatsListProps) {
  // console.log("히스토리",history);
  // const [chats, setChats] = useState<any[]>([]);

  // useMemo(async()=>{
  //   const body=await fetch(`http://localhost:4001/chats`);
  //   const chats=await body.json();
  //   setChats(chats);
  // },[]);

  // useMemo(async () => {
  //   const body = await fetch(`http://localhost:4000/graphql`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body:JSON.stringify({query:getChatsQuery})
  //   });

  //   const {data:{chats,}}=await body.json();

  //   setChats(chats);
  // }, []);

  const { data } = useChatsQuery();
 
  const navToChat = useCallback(
    chat => {
      history.push(`chats/${chat.id}`);
    },
    [history]
  );

  if (data === undefined || data.chats === undefined) {
    return null;
  }

  let chats = data.chats;


  return (
    <Container>
      <StyledList>
        {chats.map((chat: any) => (
          <StyledListItem
            key={chat.id}
            button
            data-testid="chat"
            onClick={navToChat.bind(null, chat)}
          >
            <ChatPicture
              data-testid="picture"
              src={chat.picture}
              alt="Profile"
            />
            <ChatInfo>
              <ChatName data-testid="name">{chat.name}</ChatName>
              {/* 표현식으로 chat.lastMessage가 있을때 반환하는 값을 적었기 때문에 두개의 반환이 있을 수 없다.
            따라서 하나르 Root노드를 전달해야 한다 React Fragment를 사용하던지 <Container>로 묶던지
            React Fragmaent를 사용하면 개별적 요소로 표현할 수 있다.
            */}
              {chat.lastMessage && (
                <React.Fragment>
                  <MessageContent data-testid="content">
                    {chat.lastMessage.content}
                  </MessageContent>
                  <MessageDate data-testid="date">
                    {moment(chat.lastMessage.createdAt).format("HH:mm")}
                  </MessageDate>
                </React.Fragment>
              )}
            </ChatInfo>
          </StyledListItem>
        ))}
      </StyledList>
    </Container>
  );
}
export default ChatsList;
