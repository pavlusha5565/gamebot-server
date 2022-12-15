export interface ISideEffect {
  delay?: number;
  fuelGenerate?: number;
  fuelСonsumption: number;
}

export enum EMessageType {
  text = 'text',
  image = 'image',
  voice = 'voice',
}

export enum ELocation {
  earth = 'earth',
  space = 'space',
  moon = 'moon',
  mars = 'mars',
  jupiter = 'jupiter',
  saturn = 'saturn',
  uranus = 'uranus',
  venus = 'venus',
  mercury = 'mercury',
  sun = 'sun',
  unknown = 'unknown',
}

export enum ESceneType {
  action = 'action',
  article = 'acticle',
  question = 'question',
}

export interface IScenePointer {
  type: ESceneType;
  name: string;
  sideEffect: ISideEffect;
}

export interface IStoryData {
  replies: {
    type: EMessageType;
    message?: string | null;
    messageGenerator?: string;
    src?: string;
  }[];
  buttons?: {
    text?: string | null;
    textGenerator?: string;
    nextScene: IScenePointer;
  }[];
  nextScene: IScenePointer;
}
