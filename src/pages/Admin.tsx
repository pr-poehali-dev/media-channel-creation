import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const API_VIDEOS = 'https://functions.poehali.dev/7cdb1813-de37-40a0-ad07-26a2921115df';
const API_PLAYLISTS = 'https://functions.poehali.dev/a0a846ba-96e9-424d-9475-d25193610b01';

interface Video {
  id?: number;
  title: string;
  artist: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  is_live: boolean;
  video_file?: File;
}

const Admin = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Video>({
    title: '',
    artist: '',
    video_url: '',
    thumbnail_url: '',
    duration: '',
    category: 'Поп',
    is_live: false
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploadedVideos, setUploadedVideos] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch(API_VIDEOS);
      const data = await response.json();
      const filteredData = (data || []).filter((v: any) => v.id !== 999);
      setVideos(filteredData);
      
      const videoMap = new Map();
      filteredData.forEach((video: any) => {
        const stored = localStorage.getItem(`video_${video.id}`);
        if (stored && stored.startsWith('blob:')) {
          videoMap.set(video.id, stored);
        }
      });
      setUploadedVideos(videoMap);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить видео',
        variant: 'destructive'
      });
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        setFormData({...formData, duration: `${mins}:${secs.toString().padStart(2, '0')}`});
        URL.revokeObjectURL(video.src);
      };
      video.src = url;
    } else {
      toast({
        title: 'Ошибка',
        description: 'Выберите видеофайл',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!videoFile) {
        throw new Error('Выберите видеофайл');
      }
      
      const canvas = document.createElement('canvas');
      const video = document.createElement('video');
      video.src = videoPreview;
      await new Promise(resolve => { video.onloadeddata = resolve; });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      
      const response = await fetch(API_VIDEOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          video_url: videoPreview,
          thumbnail_url: thumbnail
        })
      });

      if (response.ok) {
        const newVideo = await response.json();
        
        const newMap = new Map(uploadedVideos);
        newMap.set(newVideo.id, videoPreview);
        setUploadedVideos(newMap);
        localStorage.setItem(`video_${newVideo.id}`, videoPreview);
        
        toast({
          title: 'Успешно!',
          description: 'Видео добавлено на телеканал'
        });
        setIsDialogOpen(false);
        loadVideos();
        setFormData({
          title: '',
          artist: '',
          video_url: '',
          thumbnail_url: '',
          duration: '',
          category: 'Поп',
          is_live: false
        });
        setVideoFile(null);
        setVideoPreview('');
      } else {
        throw new Error('Failed to add video');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось добавить видео',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://cdn.poehali.dev/projects/fbad2a9f-42d3-4e7d-b2fc-05a53a772426/files/12e41dfa-1e90-495b-ab80-e2893aa361c6.jpg" 
                alt="КонтентМедиаPRO" 
                className="h-12 rounded-lg glow"
              />
              <div>
                <h1 className="text-2xl font-bold">Админ-панель</h1>
                <p className="text-sm text-muted-foreground">Управление контентом телеканала</p>
              </div>
            </div>
            <Button asChild variant="ghost">
              <a href="/">
                <Icon name="Home" size={20} className="mr-2" />
                На главную
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Видеоконтент</h2>
            <p className="text-muted-foreground">Всего видео: {videos.length}</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="glow">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить видео
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Добавить новое видео</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Название трека</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist">Исполнитель</Label>
                    <Input
                      id="artist"
                      value={formData.artist}
                      onChange={(e) => setFormData({...formData, artist: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="video_file">Видеофайл</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      id="video_file"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                    <label htmlFor="video_file" className="cursor-pointer">
                      {videoPreview ? (
                        <div className="space-y-2">
                          <video src={videoPreview} className="w-full max-h-48 rounded" controls />
                          <p className="text-sm text-muted-foreground">{videoFile?.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Нажмите для выбора видео</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Длительность</Label>
                    <Input
                      id="duration"
                      placeholder="Определится автоматически"
                      value={formData.duration}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <select
                      id="category"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Поп</option>
                      <option>Рок</option>
                      <option>Электроника</option>
                      <option>Хип-хоп</option>
                      <option>Джаз</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_live"
                    checked={formData.is_live}
                    onChange={(e) => setFormData({...formData, is_live: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_live">Показать в прямом эфире</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Загрузка...' : 'Добавить видео'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                {uploadedVideos.has(video.id) ? (
                  <video 
                    src={uploadedVideos.get(video.id)} 
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {video.is_live && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse-slow"></div>
                      LIVE
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{video.artist}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{video.duration}</span>
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                    {video.category}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Video" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-bold mb-2">Пока нет видео</h3>
            <p className="text-muted-foreground mb-6">Добавьте первое видео на ваш телеканал</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить видео
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;