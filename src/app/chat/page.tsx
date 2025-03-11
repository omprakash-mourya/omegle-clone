'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Socket, io } from 'socket.io-client';
import SimplePeer from 'simple-peer';

interface SignalData {
  type: string;
  sdp?: string;
}

interface PeerInstance extends SimplePeer.Instance {
  signal(data: string | SignalData): void;
}

interface MatchedData {
  initiator: boolean;
  targetId: string;
  roomId: string;
}

const ChatPage = () => {
  const { data: session } = useSession();
  const [peer, setPeer] = useState<PeerInstance | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // ... rest of the code ...
} 