Mr. Chera - panels 13-15 (Remotion project, 32 s, 1920x1080, 30 fps)

Render on GitHub (no install):
1. Create a PRIVATE repository on github.com.
2. Add file -> Upload files -> drag ALL files and folders of this project (src, public, .github, package.json ...). Commit once.
   (If the hidden .github folder does not upload: Add file -> Create new file, name it
   .github/workflows/render-video.yml and paste the contents of render-video.yml from this zip.)
3. Open the Actions tab -> "Render video". When it turns green, open the run and download the artifact "mr-chera-video".

Edit timing / camera / labels in src/settings.ts. CAMERA_SPEED = 0.7 means 30% slower camera.
Voice: put your narration at public/voice.mp3 and set HAS_VOICE = true in src/settings.ts.
