import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  VStack,
  Button,
  HStack,
  Input,
} from "@chakra-ui/react";
import Message from "./Message";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from "../firebase";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};
const logoutHandler = () => signOut(auth);
function ChatBox() {
  const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divForScroll = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unsubscribeMessages = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((items) => {
          const id = items.id;
          return { id, ...items.data() };
        })
      );
    });
    return () => {
      unsubscribe();
      unsubscribeMessages();
    };
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setMessage("");
      divForScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Box bg={"red.50"}>
      {user ? (
        <Container h={"100vh"} bg="white">
          <VStack h={"full"} bg={"telegram.100"} padding={"4"}>
            <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>
              Logout
            </Button>

            <VStack
              h="full"
              w={"full"}
              overflowY={"auto"}
              css={{ "&::-webkit-scrollbar": { display: "none" } }}
            >
              {messages.map((items) => (
                <Message
                  text={items.text}
                  uri={items.uri}
                  user={items.uid === user.uid ? "me" : "other"}
                />
              ))}
              <div ref={divForScroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  placeholder="Type a message"
                />
                <Button colorScheme={"purple"} type="submit">
                  send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack h={"100vh"} justifyContent={"center"}>
          <Button onClick={loginHandler} colorScheme={"purple"}>
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default ChatBox;
