# Video Locations & Thumbnail Generation

## Current Video Sources

### Featured Video (Cloudinary)
- **URL**: `https://res.cloudinary.com/dccryw710/video/upload/v1769870597/Matty_38_bh4n2o.mp4`
- **Title**: Elite Training Session
- **Status**: ✅ Active (your new video)

### Archive Videos (Dropbox)
All other videos are hosted on Dropbox with the following pattern:
- **Base Domain**: `dl.dropboxusercontent.com`
- **Format**: `/scl/fi/{file_id}/{filename}.mp4?rlkey={key}&st={token}&raw=1`

#### Video List:
1. **2021 Full Highlights** - `Matty-2021_Full-HD_60fps.mp4`
2. **2021 Basketball Trick Shots** - `Matty-Basketball-2K21_Full-HD_60fps.mp4`
3. **Late Night Sessions** - `Matty-53.mp4`
4. **Solo Session Clips** - `Matty-1.mp4` through `Matty-45.mp4`
5. **1v1 Battles** - `Matty-8-with-Alew.mp4`, `Matty-22-Lomi.mp4`, etc.

## Thumbnail Generation Options

### Option 1: Cloudinary Auto-Thumbnails
For your Cloudinary video, you can generate thumbnails automatically:

```
# Video thumbnail at 5 seconds
https://res.cloudinary.com/dccryw710/video/upload/so_5.0/v1769870597/Matty_38_bh4n2o.jpg

# Video thumbnail at 10 seconds  
https://res.cloudinary.com/dccryw710/video/upload/so_10.0/v1769870597/Matty_38_bh4n2o.jpg

# Video thumbnail with transformations (resize, quality)
https://res.cloudinary.com/dccryw710/video/upload/w_400,h_300,c_fill,q_auto,so_5.0/v1769870597/Matty_38_bh4n2o.jpg
```

### Option 2: Extract Thumbnails from Dropbox Videos
For Dropbox videos, you'll need to:
1. Download the video files locally
2. Use FFmpeg to extract frames: `ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg`
3. Upload thumbnails to Cloudinary or another CDN

### Option 3: Video Poster Frames
The HTML5 video element can show poster frames:
```html
<video poster="thumbnail.jpg" src="video.mp4"></video>
```

## Recommended Approach

1. **Keep your Cloudinary video as the featured/background video**
2. **Generate Cloudinary thumbnails** for the featured video using the URLs above
3. **For Dropbox videos**: Either extract thumbnails manually or use the video's first frame as a poster
4. **Update the `thumbnail` field** in the constants file with the generated thumbnail URLs

Would you like me to help you implement any of these thumbnail generation methods?