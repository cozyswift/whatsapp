import React from "react";
// import ChatsNavbar from "./ChatsNavbar";
import ChatsNavbar from "./ChatsNavBar";
import ChatsList from "./ChatsList";
import styled from "styled-components";
import { History } from "history";

const Container = styled.div`
  height: 100vh;
`;

interface ChatsListScreenProps {
  history: History;
}
function ChatsListScreen({ history }: ChatsListScreenProps) {
  return (
    <Container>
      <ChatsNavbar history={history} />
      <ChatsList history={history} />
    </Container>
  );
}

export default ChatsListScreen;
