'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { Video, Mic, MicOff, VideoOff } from 'lucide-react';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMatching, setIsMatching] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const peerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      // Connect to socket server
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

      // Get local stream
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing media devices:', err);
        });

      // Socket event handlers
      socketRef.current.on('matched', ({ initiator, targetId }) => {
        setIsMatching(false);
        setIsChatting(true);
        
        // Create peer connection
        const peer = new SimplePeer({
          initiator,
          stream: streamRef.current,
          trickle: false,
        });

        peer.on('signal', (data: any) => {
          socketRef.current.emit('signal', { signal: data, targetId });
        });

        peer.on('stream', (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        socketRef.current.on('signal', ({ signal }) => {
          peer.signal(signal);
        });

        peerRef.current = peer;
      });

      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        if (peerRef.current) {
          peerRef.current.destroy();
        }
      };
    }
  }, [status]);

  const startMatching = () => {
    setIsMatching(true);
    socketRef.current?.emit('startMatching', { userId: session?.user?.id });
  };

  const skipChat = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setIsChatting(false);
    startMatching();
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                isIconOnly
                className={`rounded-full ${!audioEnabled ? 'bg-red-500' : 'bg-white'}`}
                onClick={toggleAudio}
              >
                {audioEnabled ? <Mic /> : <MicOff />}
              </Button>
              <Button
                isIconOnly
                className={`rounded-full ${!videoEnabled ? 'bg-red-500' : 'bg-white'}`}
                onClick={toggleVideo}
              >
                {videoEnabled ? <Video /> : <VideoOff />}
              </Button>
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!isChatting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white"
                  isLoading={isMatching}
                  onClick={startMatching}
                >
                  {isMatching ? 'Finding a match...' : 'Start Matching'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {isChatting && (
          <div className="mt-4 flex justify-center">
            <Button
              color="danger"
              variant="flat"
              onClick={skipChat}
            >
              Skip & Find New Match
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 