import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const API_VIDEOS = 'https://functions.poehali.dev/7cdb1813-de37-40a0-ad07-26a2921115df';
const API_PLAYLISTS = 'https://functions.poehali.dev/a0a846ba-96e9-424d-9475-d25193610b01';

const Index = () => {
  const [isLive, setIsLive] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [liveVideo, setLiveVideo] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [videosRes, playlistsRes] = await Promise.all([
        fetch(API_VIDEOS),
        fetch(API_PLAYLISTS)
      ]);
      
      const videosData = await videosRes.json();
      const playlistsData = await playlistsRes.json();
      
      setVideos(videosData || []);
      setPlaylists(playlistsData || []);
      
      const live = videosData?.find((v: any) => v.is_live);
      if (live) {
        setLiveVideo(live);
        setSelectedVideo(live);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://cdn.poehali.dev/projects/fbad2a9f-42d3-4e7d-b2fc-05a53a772426/files/12e41dfa-1e90-495b-ab80-e2893aa361c6.jpg" 
                alt="КонтентМедиаPRO" 
                className="h-12 rounded-lg glow"
              />
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  КонтентМедиаPRO
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Icon name="Search" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Bell" size={20} />
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin">
                  <Icon name="Settings" size={20} className="mr-2" />
                  Админ-панель
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-2 border-primary/20 glow">
              {selectedVideo ? (
                <div className="aspect-video bg-black relative">
                  {liveVideo && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge variant="destructive" className="text-lg px-4 py-1">
                        <div className="w-3 h-3 rounded-full bg-white animate-pulse-slow mr-2"></div>
                        ПРЯМОЙ ЭФИР
                      </Badge>
                    </div>
                  )}
                  <video 
                    src={selectedVideo.video_url} 
                    controls 
                    autoPlay
                    className="w-full h-full"
                    poster={selectedVideo.thumbnail_url}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="Tv" size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Нет активного эфира</h2>
                      <p className="text-muted-foreground">Добавьте видео в админ-панели</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">
                  {selectedVideo ? selectedVideo.title : 'В эфире сейчас'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {selectedVideo ? selectedVideo.artist : 'Топ 100 хитов недели'}
                </p>
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="outline">
                    <Icon name="Share2" size={16} className="mr-2" />
                    Поделиться
                  </Button>
                  <Button size="sm" variant="outline">
                    <Icon name="Heart" size={16} className="mr-2" />
                    В избранное
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="ListMusic" size={24} />
                Плейлисты
              </h3>
              <div className="space-y-3">
                {playlists.map((playlist) => (
                  <Card 
                    key={playlist.id}
                    className={`p-4 cursor-pointer hover:scale-105 transition-transform border-l-4 ${playlist.color.replace('bg-', 'border-l-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${playlist.color}`}>
                        <Icon name={playlist.icon} size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{playlist.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {playlist.video_count || 0} видео
                        </p>
                      </div>
                      <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Icon name="Film" size={32} className="text-primary" />
              Видеоархив
            </h2>
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="popular">Популярное</TabsTrigger>
                <TabsTrigger value="new">Новинки</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {videos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card 
                  key={video.id}
                  className="overflow-hidden cursor-pointer hover:scale-105 transition-all hover:border-primary"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="lg" variant="secondary" className="glow">
                        <Icon name="Play" size={32} />
                      </Button>
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black/80">
                      {video.duration}
                    </Badge>
                    {video.is_live && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse-slow mr-1"></div>
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{video.artist}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                        {video.category}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="Eye" size={14} />
                        <span>{video.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Icon name="Video" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">Пока нет видео</h3>
              <p className="text-muted-foreground mb-6">Добавьте первое видео в админ-панели</p>
              <Button asChild>
                <a href="/admin">
                  <Icon name="Settings" size={20} className="mr-2" />
                  Перейти в админ-панель
                </a>
              </Button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 КонтентМедиаPRO. Музыка 24/7</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;