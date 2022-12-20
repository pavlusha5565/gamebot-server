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
  scene = 'story',
  question = 'question',
}

export interface IScenePointer {
  type: ESceneType;
  name: string;
}

export interface IReply {
  type: EMessageType;
  message?: string | null;
  messageGenerator?: string;
  src?: string;
}

export interface IButton {
  text?: string | null;
  textGenerator?: string;
  nextScene: IScenePointer;
}

export interface IStoryData {
  replies: IReply[];
  buttons?: IButton[];
  nextScene: IScenePointer;
}

export interface IQuestionData {
  replies: IReply[];
  buttons?: IButton[];
  answers?: string[];
  repeats?: number;
  nextScene: IScenePointer;
}
