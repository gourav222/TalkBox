import { HStack,Text,Avatar } from '@chakra-ui/react'
import React from 'react'

function Message({text,uri,user="other"}) {
  return (
    <HStack alignSelf={user === "me" ? "flex-end" : 'flex-start'} bg="gray.200" borderRadius={"base"} paddingY={"1"} paddingX={"3"}>
        {
          user==="other" && <Avatar src={uri}></Avatar>
        }
        <Text>{text}</Text> 
        {
          user==="me" && <Avatar src={uri}></Avatar>
        }
    </HStack>
  )
}

export default Message