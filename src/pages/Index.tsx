import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isLive, setIsLive] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const playlists = [
    {
      id: 1,
      name: 'Хиты 2025',
      icon: 'Flame',
      color: 'bg-primary',
      videos: 24
    },
    {
      id: 2,
      name: 'Рок',
      icon: 'Guitar',
      color: 'bg-secondary',
      videos: 18
    },
    {
      id: 3,
      name: 'Поп',
      icon: 'Music',
      color: 'bg-accent',
      videos: 32
    },
    {
      id: 4,
      name: 'Электроника',
      icon: 'Zap',
      color: 'bg-purple-500',
      videos: 21
    }
  ];

  const videoArchive = [
    {
      id: 1,
      title: 'Summer Vibes 2025',
      artist: 'DJ Energy',
      duration: '3:45',
      views: '2.4M',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Electric Dreams',
      artist: 'Neon Pulse',
      duration: '4:12',
      views: '1.8M',
      thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'City Lights',
      artist: 'Metro Band',
      duration: '3:28',
      views: '3.1M',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Midnight Run',
      artist: 'Shadow Beats',
      duration: '4:01',
      views: '1.5M',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Rhythm & Soul',
      artist: 'Groove Masters',
      duration: '3:55',
      views: '2.7M',
      thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Neon Paradise',
      artist: 'Cyber Wave',
      duration: '4:33',
      views: '1.9M',
      thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop'
    }
  ];

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
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse-slow"></div>
                      <Badge variant="destructive" className="text-lg px-4 py-1">
                        <Icon name="Radio" size={16} className="mr-2" />
                        ПРЯМОЙ ЭФИР
                      </Badge>
                    </div>
                    <h2 className="text-4xl font-bold mb-2">Live Stream</h2>
                    <p className="text-muted-foreground">Лучшие хиты 24/7</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="absolute bottom-4 right-4 glow"
                  onClick={() => setIsLive(!isLive)}
                >
                  <Icon name={isLive ? "Pause" : "Play"} size={24} />
                </Button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">В эфире сейчас</h3>
                <p className="text-muted-foreground mb-4">Топ 100 хитов недели</p>
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
                          {playlist.videos} видео
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoArchive.map((video) => (
              <Card 
                key={video.id}
                className="overflow-hidden cursor-pointer hover:scale-105 transition-all hover:border-primary"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={video.thumbnail} 
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
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{video.artist}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Eye" size={14} />
                    <span>{video.views} просмотров</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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