export enum EMessageType {
  text = 'text',
  textGenerator = 'textGenerator',
  image = 'image',
  voice = 'voice',
}

export enum EButtonType {
  button = 'button',
  buttonGenerator = 'buttonGenerator',
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

export interface ISideEffect {
  delay?: number;
  energyConsumation: number;
}

export interface IScenePointer {
  type: ESceneType;
  scene: string;
  sideEffect?: ISideEffect;
}

export interface IReply {
  type: EMessageType;
  content: string;
}

export interface IButton {
  type: EButtonType;
  content: string;
  nextScene: IScenePointer;
}

export interface IStoryData {
  replies: IReply[];
  buttons?: IButton[];
  nextScene?: IScenePointer;
}
