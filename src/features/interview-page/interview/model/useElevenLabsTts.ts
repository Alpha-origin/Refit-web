import { useEffect, useRef, useState } from "react";
import type { QuestionAudioStatus } from "@/widgets/interview-page/interview/type";

const ELEVENLABS_TTS_API_URL = "/api/elevenlabs/tts";
const ELEVENLABS_VOICES_API_URL = "/api/elevenlabs/voices";
const ELEVENLABS_CONFIGURED_VOICE_ID =
  import.meta.env.VITE_ELEVENLABS_VOICE_ID?.trim();
const ELEVENLABS_VOICE_NAME = "Kelee K - Seoul Narrator";
const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128";
const ELEVENLABS_SPEECH_SPEED = 1.1;

const isPlaceholderVoiceId = (voiceId: string | undefined) =>
  !voiceId || voiceId === "Kelee_K_Voice_ID";

const getVoiceIdFromAccount = async (signal: AbortSignal) => {
  const searchParams = new URLSearchParams({
    search: ELEVENLABS_VOICE_NAME,
    page_size: "100",
  });
  const response = await fetch(`${ELEVENLABS_VOICES_API_URL}?${searchParams}`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs voice list failed with ${response.status}`);
  }

  const payload: unknown = await response.json();
  const voices =
    payload && typeof payload === "object" && "voices" in payload &&
    Array.isArray(payload.voices)
      ? payload.voices
      : [];
  const matchedVoice = voices.find((voice) => {
    if (!voice || typeof voice !== "object") {
      return false;
    }

    return (voice as { name?: unknown }).name === ELEVENLABS_VOICE_NAME;
  });

  const voiceId =
    matchedVoice && typeof matchedVoice === "object"
      ? (matchedVoice as { voice_id?: unknown }).voice_id
      : null;

  if (typeof voiceId !== "string" || !voiceId.trim()) {
    throw new Error(
      `ElevenLabs voice not found: ${ELEVENLABS_VOICE_NAME}. Add the voice to your account or set VITE_ELEVENLABS_VOICE_ID.`,
    );
  }

  return voiceId.trim();
};

const createSpeechRequest = (text: string) =>
  JSON.stringify({
    text,
    model_id: ELEVENLABS_MODEL_ID,
    voice_settings: {
      speed: ELEVENLABS_SPEECH_SPEED,
    },
  });

export const useElevenLabsTts = (text: string) => {
  const [status, setStatus] = useState<QuestionAudioStatus>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const resolvedVoiceIdRef = useRef<string | null>(null);
  const voiceIdRequestRef = useRef<Promise<string> | null>(null);

  const clearAudioUrl = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const releaseAudio = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.onended = null;
    audioRef.current = null;
  };

  const stop = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    releaseAudio();
    clearAudioUrl();
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      releaseAudio();
      clearAudioUrl();
    };
  }, []);

  const play = async () => {
    if (!text.trim() || status === "loading") {
      return;
    }

    stop();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setStatus("loading");

    try {
      if (!resolvedVoiceIdRef.current) {
        if (!isPlaceholderVoiceId(ELEVENLABS_CONFIGURED_VOICE_ID)) {
          resolvedVoiceIdRef.current = ELEVENLABS_CONFIGURED_VOICE_ID;
        } else {
          const voiceIdRequest =
            voiceIdRequestRef.current ?? getVoiceIdFromAccount(controller.signal);
          voiceIdRequestRef.current = voiceIdRequest;

          try {
            resolvedVoiceIdRef.current = await voiceIdRequest;
          } catch (error) {
            voiceIdRequestRef.current = null;
            throw error;
          }
        }
      }

      const response = await fetch(
        `${ELEVENLABS_TTS_API_URL}/${encodeURIComponent(resolvedVoiceIdRef.current)}?output_format=${ELEVENLABS_OUTPUT_FORMAT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: createSpeechRequest(text),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS failed with ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;
      audioUrlRef.current = audioUrl;

      audio.onended = () => {
        releaseAudio();
        clearAudioUrl();
        setStatus("idle");
      };

      await audio.play();
      setStatus("playing");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      releaseAudio();
      clearAudioUrl();
      setStatus("idle");
      console.error("Failed to play ElevenLabs TTS.", error);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const toggle = () => {
    if (status === "playing") {
      stop();
      return;
    }

    void play();
  };

  return {
    onPlay: play,
    status,
    onStop: stop,
    onToggle: toggle,
  };
};
