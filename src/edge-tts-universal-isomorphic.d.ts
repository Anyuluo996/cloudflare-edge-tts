declare module "edge-tts-universal/isomorphic" {
  export type Voice = {
    Name: string;
    ShortName: string;
    Gender: string;
    Locale: string;
    SuggestedCodec: string;
    FriendlyName: string;
    Status: string;
    VoiceTag: {
      ContentCategories: string[];
      VoicePersonalities: string[];
    };
  };

  export type TtsChunk =
    | {
        type: "audio";
        data: Uint8Array;
      }
    | {
        type: string;
        data?: Uint8Array;
        [key: string]: unknown;
      };

  export class Communicate {
    constructor(text: string, options: { voice?: string });
    stream(): AsyncIterableIterator<TtsChunk>;
  }

  export function listVoices(): Promise<Voice[]>;
}
