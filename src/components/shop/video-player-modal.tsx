"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoPlayerModalProps {
  videoUrl: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function VideoPlayerModal({ videoUrl, isOpen, onOpenChange, title }: VideoPlayerModalProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  // Simple check for direct video files.
  const isDirectVideo = videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.endsWith('.ogg');
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          {embedUrl ? (
             <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
          ) : isDirectVideo ? (
            <video controls autoPlay className="w-full h-full rounded-lg">
                <source src={videoUrl} type={`video/${videoUrl.split('.').pop()}`} />
                Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-center text-muted-foreground">Unsupported video URL. Please use a YouTube link or a direct video file (mp4, webm, ogg).</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
