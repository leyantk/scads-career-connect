
import React, { useState } from 'react';
import { X, Video, VideoOff, Mic, MicOff, PhoneOff, MonitorUp } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

// This is a mock video call component for the prototype
const VideoCall = ({ 
  callPartner = { name: 'John Doe', role: 'SCAD Office', avatar: 'JD' },
  onEndCall = () => {}
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.info(`Video ${!isVideoOn ? 'enabled' : 'disabled'}`);
  };
  
  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast.info(`Microphone ${!isAudioOn ? 'unmuted' : 'muted'}`);
  };
  
  const toggleScreenShare = () => {
    setIsSharing(!isSharing);
    toast.info(`Screen sharing ${!isSharing ? 'started' : 'stopped'}`);
  };
  
  const handleEndCall = () => {
    toast.info('Call ended');
    onEndCall();
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <div className="text-white flex items-center">
          <span className="font-medium">Call with {callPartner.name}</span>
          <span className="ml-2 text-xs bg-green-600 px-2 py-0.5 rounded-full">Live</span>
        </div>
        <Button variant="ghost" size="sm" className="text-white" onClick={handleEndCall}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-grow p-4 relative">
        {/* Main video area (partner's video) */}
        <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
          {isSharing ? (
            <div className="text-center text-white">
              <div className="mx-auto w-32 h-24 bg-gray-800 rounded mb-2 flex items-center justify-center">
                <MonitorUp className="h-10 w-10 text-gray-400" />
              </div>
              <p>Screen sharing is active</p>
            </div>
          ) : (
            <div className="text-center text-white">
              <div className="h-20 w-20 rounded-full bg-scad-blue flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-medium">{callPartner.avatar}</span>
              </div>
              <p>{isVideoOn ? callPartner.name : "Camera off"}</p>
            </div>
          )}
        </div>
        
        {/* Self view (smaller) */}
        <div className="absolute bottom-8 right-8 w-48 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center overflow-hidden">
          {isVideoOn ? (
            <div className="h-full w-full bg-gray-900 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-scad-blue flex items-center justify-center">
                <span className="text-lg font-medium text-white">You</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <VideoOff className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Camera off</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-800 flex justify-center space-x-4">
        <Button 
          variant="secondary" 
          size="icon" 
          className={isAudioOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}
          onClick={toggleAudio}
        >
          {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className={isVideoOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className={isSharing ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}
          onClick={toggleScreenShare}
        >
          <MonitorUp className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="destructive" 
          size="icon"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
