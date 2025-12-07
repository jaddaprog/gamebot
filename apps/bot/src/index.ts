/**
 * Main gamebot application
 */

import { initialize } from '@gamebot/core';
import { formatMessage } from '@gamebot/utils';

console.log(formatMessage('Starting gamebot...'));
initialize();
console.log(formatMessage('Gamebot is running!'));
