import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { addMessage } from "../features/messageSlice";

const ChatMessages = () => {
  const { selectedUser } = useSelector((state) => state.user);
  const loggedInUserId = useSelector((state) => state.auth.userData?._id);
  const {messages,groupMessages,chattingWithUser} = useSelector((state) => state.message);
  const {selectedGroup}=useSelector(state=>state.group);

  // Reference to scroll to the bottom
  const showMessage=chattingWithUser?messages[selectedUser?.userName]:groupMessages[selectedUser?._id];
  const messagesEndRef = useRef(null);
  const dispatch=useDispatch();

  const { socket } = useSocket();

  useEffect(() => {
    const handleIncomingMessage = (payload) => {
      dispatch(
        addMessage({
          senderId: payload?.by._id,
          content: payload.message,
          Date: Date.now(),
          userName: payload?.by.userName,
        })
      );
    };
    socket.on('message', handleIncomingMessage);

    return () => {
      socket.off('message', handleIncomingMessage);
    };
  }, [socket, dispatch, loggedInUserId]);

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]); // Scroll whenever messages change

  return (
    <div className="max-h-[80%] w-full bg-base-100 p-5 flex flex-col justify-end rounded-lg border border-base-300 overflow-hidden shadow-inner shadow-slate-400">
      {" "}
      {/* DaisyUI bg and border */}
      {/* Scrollable message container */}
      <div className="flex-2 overflow-y-auto scrollbar-hide pr-2">
        {/* Map messages from the bottom to top */}
        {showMessage?.map((msg, index) => (
          <div
            key={index}
            className={`mb-1 ${msg.sender === loggedInUserId ? "text-right" : "text-left"
              }`}
          >
            <div
              className={`relative inline-block p-1 mt-2 rounded-3xl max-w-[70%] ${msg.sender === loggedInUserId
                  ? "bg-primary text-primary-content ml-auto"
                  : "bg-neutral text-neutral-content mr-auto"
                }`}
            >
              {/* Message Content */}
              <p className="px-3 py-1 textarea-lg text-xl font-medium break-words">{msg.content}</p>

              {/* Message Timestamp */}
              <p className="text-sm text-right px-3 pb-1">
                {new Date(msg.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {/* Scroll to the latest message */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
