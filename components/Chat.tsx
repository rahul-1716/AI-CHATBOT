import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Markdown from "react-native-markdown-display"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from 'react'
import {GoogleGenerativeAI} from "@google/generative-ai"
type Message = {
  sender: "user" | "ai";
  content: string;
}

const Chat = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([{
    sender: "ai",
    content: "Hello! , How can i help you today Rahul?"
  }])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const handleSend = async () => {
    if(!message.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      content: message
    }

    const updatedHistory = [
      ...history,
      {role: "user", parts: [{
        text: message.trim(),
      },],},
    ]
    setMessages((prev)=>[...prev, userMsg])
    setMessage("");
    setLoading(true)
    const typingIndicator:Message = {
      sender: "ai",
      content: "..."
    }
    setMessages((prev)=>[...prev, typingIndicator])
    try{
      const APIKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
      if(!APIKey){
        Alert.alert("Error, Something went wrong with API")
        return;
      }
      const genAI = new GoogleGenerativeAI(APIKey)

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const chat = model.startChat({
        history: updatedHistory,
      })

      


      const result = await chat.sendMessage(message.trim())
      const responseText = result.response.text();
      finalizeLastMessage(responseText)
    } catch(error: any){
      Alert.alert("Error", "Something went wrong")
       finalizeLastMessage("Something went wrong lil bro")
       console.log(error)
    } finally{
      setLoading(false)
    }
    
  }
     const finalizeLastMessage = (text: string) => {
      setMessages((prev) => prev.map((msg, i)=> i === prev.length -1 ? {
        sender: "ai",
        content: text
      } : msg))
    }
  return (
    <View style={{
      flex: 1,
      backgroundColor: 'black'
    }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: "gray",
          alignItems: 'center'
        }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
            ChatBot ProtoType 1
          </Text>
        </View>

        {/* CHAT MESSAGES */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
          {messages.map((message, index) => (
            <View key={index} style={[
              {
                flexDirection: "row",
                marginTop: 12
              },
              message.sender === "user" ? {
                justifyContent: 'flex-end',
              } : {
                justifyContent: 'flex-start'
              },
            ]}>
              <View style={[{
                paddingHorizontal: 16,
                paddingVertical: 2,
                borderRadius: 24,
              },
              message.sender === "user" ? {
                backgroundColor: "#20a4f3",
                maxWidth: '85%',
              } : {
                backgroundColor: "",
                width: "100%",
              }
              ]}>
                <Markdown
                  style={{
                    body: { color: "white", fontSize: 16 },
                    text: { color: "white" },
                    paragraph: { color: "white", marginBottom: 8 },
                    strong: { color: "white", fontWeight: "bold" },
                    em: { color: "white", fontStyle: "italic" },
                    // Inline code
                    code_inline: {
                      backgroundColor: "rgba(0,0,0,0.3)",
                      color: "white",
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      borderRadius: 4,
                      fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
                    },
                    // Code blocks
                    code_block: {
                      backgroundColor: "rgba(0,0,0,0.3)",
                      color: "white",
                      padding: 12,
                      borderRadius: 8,
                      fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
                      marginVertical: 8,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                    },
                    fence: {
                      backgroundColor: "rgba(0,0,0,0.3)",
                      color: "white",
                      padding: 12,
                      borderRadius: 8,
                      fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
                      marginVertical: 8,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                    },
                    // Tables
                    table: {
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.2)",
                      borderRadius: 6,
                      marginVertical: 8,
                      overflow: "hidden",
                    },
                    thead: {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    th: {
                      padding: 8,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.2)",
                      fontWeight: "bold",
                      color: "white",
                    },
                    tr: {
                      borderBottomWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                      flexDirection: "row",
                    },
                    td: {
                      padding: 8,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "white",
                    },
                    tbody: {
                      backgroundColor: "rgba(0,0,0,0.2)",
                    },
                    // Headings
                    heading1: {
                      color: "white",
                      fontSize: 24,
                      fontWeight: "bold",
                      marginVertical: 8,
                    },
                    heading2: {
                      color: "white",
                      fontSize: 20,
                      fontWeight: "bold",
                      marginVertical: 6,
                    },
                    heading3: {
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginVertical: 4,
                    },
                    // Lists
                    bullet_list: { marginVertical: 4 },
                    ordered_list: { marginVertical: 4 },
                    list_item: { color: "white", marginBottom: 4 },
                    bullet_list_icon: { color: "white" },
                    ordered_list_icon: { color: "white" },
                    // Links
                    link: { color: "#93c5fd", textDecorationLine: "underline" },
                    // Blockquotes
                    blockquote: {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderLeftWidth: 4,
                      borderLeftColor: "rgba(255,255,255,0.3)",
                      padding: 8,
                      marginVertical: 8,
                    },
                    // Horizontal rule
                    hr: {
                      backgroundColor: "rgba(255,255,255,0.2)",
                      height: 1,
                      marginVertical: 12,
                    },
                  }}
                  onLinkPress={(url) => {
                    Linking.openURL(url);
                    return false;
                  }}
                >
                  {message.content}
                </Markdown>
              </View>
            </View>
          ))}
        </ScrollView>
        {/* Input Area */}
        <View style={{
          flexDirection: "row",
          gap : 8,
          alignItems: 'flex-end',
          backgroundColor: "black",
          paddingTop: 8,
          borderTopWidth: 1,
          paddingHorizontal: 8,
        }}>
        <TextInput
        multiline
        value={message}
        onChange={(e)=> setMessage(e.nativeEvent.text)}
        placeholder='Ask me anything...'
        placeholderTextColor="#888b9c"
         style={{
          flex:1,
          maxHeight:120,
          minHeight:40,
          paddingVertical:10,
          paddingHorizontal:15,
          backgroundColor:"#2a2a2b",
          color:'white',
          fontSize:18,
          borderRadius: 20
        }} />
        <TouchableOpacity
        onPress={handleSend}
        disabled={!message.trim() || loading}
        activeOpacity={0.7}
        style={{
          backgroundColor: "white",
          borderRadius: 999,
          padding:10,
        }}>
          <Ionicons name="send" size={20} color="black" />
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({})
