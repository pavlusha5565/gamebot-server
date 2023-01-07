export enum telegramCommands {
  start = 'start',
  register = 'register',
  unregister = 'unregister',
  play = 'play',
  leave = 'leave',
  help = 'help',
  info = 'info',
}

export const commandInfo = {
  [telegramCommands.register]: 'Регистрация пользователя.',
  [telegramCommands.unregister]: 'Удаление привязки пользователя.',
  [telegramCommands.help]: 'Вывод данной справки',
  [telegramCommands.info]: 'Вывод общей информации',
  [telegramCommands.play]: 'Запуск сессии игры',
  [telegramCommands.leave]: 'Покинуть сессию',
};
