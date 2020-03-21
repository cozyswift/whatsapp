import React from 'react';
import {
  BrowserRouter,
  Route,
  Redirect,
  RouteComponentProps,
} from 'react-router-dom';
import ChatRoomScreen from './components/ChatRoomScreen';
import ChatsListScreen from './components/ChatsListScreen';
import AnimatedSwitch from './components/AnimatedSwitch';
import { useCacheService } from './services/cache.service';



function App() {

  useCacheService();

  return (
    <BrowserRouter>
      <AnimatedSwitch>
        <Route exact path="/chats" component={ChatsListScreen} />
        <Route
          exact
          path="/chats/:chatId"
          // path의 경로의 따라 match의 params 값이 바뀐다.
          // 여러개의 변수는 /chats/:chatId:name 이런형태로 넘긴다

          component={({
            match,
            history
          }: RouteComponentProps<{
            chatId: string;
          }>) => (
            <ChatRoomScreen
              chatId={match.params.chatId}
              match={match}
              history={history}
            />
          )}
        />
      </AnimatedSwitch>
      <Route exact path="/" component={redirectToChats} />
    </BrowserRouter>
  );
}

const redirectToChats = () => <Redirect to="/chats" />;

export default App;
