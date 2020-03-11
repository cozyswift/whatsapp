import React from "react";
import ReactDOM from "react-dom";
import {
  cleanup,
  render,
  fireEvent,
  wait,
  waitForDomChange
} from "@testing-library/react";
import ChatsList from "./ChatsList";
import { createBrowserHistory } from "history";
declare global {
  interface Window {
    location:Location;
  }
  interface Location { href: string; }
}



describe("채팅리스트 테스트", () => {
  afterEach(() => {
    cleanup();
    //테스트 끝난 데이터 정리
    
    delete window.location;
    window.location.href="/";
  
  });

  it("채팅 아이템", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          chats: [
            {
              id: 1,
              name: "Foo bar",
              picture: "https://localhost:4000/picture.jpg",
              lastMessage: {
                id: 1,
                content: "Hello",
                createdAt: new Date("1 Jan 2019 GMT")
              }
            }
          ]
        }
      })
    );
    const history = createBrowserHistory();
    {
      const { container, getByTestId } = render(<ChatsList history={history}/>);
      await waitForDomChange({ container });

      expect(getByTestId("name")).toHaveTextContent("Foo bar");
      expect(getByTestId("picture")).toHaveAttribute(
        "src",
        "https://localhost:4000/picture.jpg"
      );
      expect(getByTestId("content")).toHaveTextContent("Hello");
      expect(getByTestId("date")).toHaveTextContent("09:00");
    }
  });

  it("채팅을 클릭하면 체팅방을 찾아가야 한다.", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          chats: [
            {
              id: 1,
              name: "Foo Bar",
              picture: "https://localhost:4000/picture.jpg",
              lastMessage: {
                id: 1,
                content: "Hello",
                createdAt: new Date("1 Jan 2019 GMT")
              }
            }
          ]
        }
      })
    );
    const history = createBrowserHistory();

    {
      const { container, getByTestId } = render(
        <ChatsList history={history} />
      );

      await waitForDomChange({ container });
      fireEvent.click(getByTestId("chat"));

      await wait(() => {
        expect(history.location.pathname).toEqual("/chats/1");
      });
    }
  });
});
