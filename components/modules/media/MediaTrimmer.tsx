"use client";
import React, { useState, useRef, useEffect } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Video, AudioLines, Trash2, Scissors, Download, RefreshCw, AlertCircle, Film } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function MediaTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"video" | "audio" | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [trimming, setTrimming] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize FFmpeg
  useEffect(() => {
    loadFFmpeg();
    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
    };
  }, []);

  const loadFFmpeg = async () => {
    try {
      const ffmpegInstance = new FFmpeg();
      
      // Load from unpkg CDN to run completely serverless
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      
      ffmpegInstance.on("progress", ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      setFfmpeg(ffmpegInstance);
      setReady(true);
    } catch (err: any) {
      console.error("FFmpeg load error:", err);
      setErrorMsg(
        "WASM headers missing. FFmpeg.wasm requires SharedArrayBuffer. Please verify headers or use Chrome/Firefox with cross-origin isolation flags."
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFile(e.target.files[0]);
    }
  };

  const loadFile = (selectedFile: File) => {
    const isVideo = selectedFile.type.startsWith("video/");
    const isAudio = selectedFile.type.startsWith("audio/");
    
    if (!isVideo && !isAudio) {
      alert("Unsupported file type. Please upload a video or audio file.");
      return;
    }

    setFile(selectedFile);
    setFileType(isVideo ? "video" : "audio");
    
    const url = URL.createObjectURL(selectedFile);
    setMediaUrl(url);
    setTrimmedUrl(null);
    setStartTime(0);
    setProgress(0);

    // Read duration
    if (isVideo) {
      const tempVideo = document.createElement("video");
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        setDuration(tempVideo.duration);
        setEndTime(tempVideo.duration);
      };
    } else {
      const tempAudio = document.createElement("audio");
      tempAudio.src = url;
      tempAudio.onloadedmetadata = () => {
        setDuration(tempAudio.duration);
        setEndTime(tempAudio.duration);
      };
    }
  };

  const handleTrim = async () => {
    if (!ffmpeg || !file) return;
    setTrimming(true);
    setProgress(0);
    setErrorMsg(null);

    const inputName = `input.${file.name.split(".").pop()}`;
    const outputName = `output.${file.name.split(".").pop()}`;

    try {
      // Write target to memory filesystem
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Exec command: -ss start, -to end, -c copy (copy codecs for high speed trim)
      await ffmpeg.exec([
        "-i",
        inputName,
        "-ss",
        startTime.toFixed(2),
        "-to",
        endTime.toFixed(2),
        "-c",
        "copy",
        outputName,
      ]);

      // Read final compilation output
      const data = await ffmpeg.readFile(outputName);
      const outputBlob = new Blob([data as any], { type: file?.type });
      
      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
      setTrimmedUrl(URL.createObjectURL(outputBlob));
    } catch (err: any) {
      console.error("FFmpeg trim failure:", err);
      setErrorMsg("Trim operation failed. This codec might not support stream copy slicing.");
    } finally {
      setTrimming(false);
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const milliseconds = Math.floor((secs % 1) * 100);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setFile(null);
    setMediaUrl(null);
    setFileType(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setTrimmedUrl(null);
    setProgress(0);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Upload and preview Area */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        {!mediaUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-3xl p-12 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer min-h-[400px] group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*, audio/*"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-850 dark:text-white">Load Media File</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
              Supports MP4, MP3, WebM, WAV, etc. Sliced completely in the browser sandbox.
            </p>
            <Button className="mt-8">Select File</Button>
          </div>
        ) : (
          <div className="utility-card border rounded-3xl p-6 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden bg-slate-950">
            <span className="absolute top-4 left-4 bg-black/60 text-white text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-lg backdrop-blur z-10">
              Media Stream Source
            </span>
            
            {fileType === "video" ? (
              <video
                ref={videoRef}
                src={mediaUrl}
                controls
                className="w-full max-h-[380px] rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center space-y-4">
                <AudioLines className="w-16 h-16 text-brand-500 animate-pulse" />
                <audio ref={audioRef} src={mediaUrl} controls className="w-full max-w-md" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trimming & control console */}
      <div className="lg:col-span-5">
        {mediaUrl ? (
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-4">
              <div>
                <CardTitle>Chrono Trim Console</CardTitle>
                <CardDescription>Drag sliders to clip timestamps</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 p-4 rounded-2xl flex gap-2 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Range Selection Sliders */}
            <div className="space-y-6">
              {/* Start Time */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Start Timestamp</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{formatTime(startTime)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={startTime}
                  onChange={(e) => setStartTime(Math.min(parseFloat(e.target.value), endTime - 0.1))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>End Timestamp</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{formatTime(endTime)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={endTime}
                  onChange={(e) => setEndTime(Math.max(parseFloat(e.target.value), startTime + 0.1))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-1">
                <span>Clip Duration</span>
                <span className="font-mono">{formatTime(endTime - startTime)}</span>
              </div>
            </div>

            {/* Trimming Status */}
            {trimming && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Encoding progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Process controls */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {!trimmedUrl ? (
                <Button
                  onClick={handleTrim}
                  disabled={trimming || !ready}
                  className="w-full py-3 flex items-center justify-center gap-2"
                >
                  {trimming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Trimming Streams...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4" /> Clip and Export
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <a
                    href={trimmedUrl}
                    download={`omnikits_trimmed_${Date.now()}.${file?.name.split(".").pop() || "mp4"}`}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20"
                  >
                    <Download className="w-4 h-4" /> Download Trimmed Clip
                  </a>
                  
                  <Button
                    variant="outline"
                    onClick={() => setTrimmedUrl(null)}
                    className="w-full py-3"
                  >
                    Trim Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 p-6 rounded-3xl text-center text-slate-400 min-h-[300px] flex flex-col items-center justify-center space-y-3">
            <Video className="w-10 h-10 text-slate-300 dark:text-slate-800" />
            <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Trimmer locked</h4>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              Upload a video or audio file first to access the timeline sliders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
