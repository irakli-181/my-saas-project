import type { NavigationItem } from '../NavBar/NavBar';
import { routes } from 'wasp/client/router';
import { BlogUrl, DocsUrl } from '../../../shared/common';

export const appNavigationItems: NavigationItem[] = [
  { name: 'AI Scheduler (Demo App)', to: routes.DemoAppRoute.to },
  { name: 'Click Timer', to: routes.TimerGameRoute.to },
  { name: 'Keystroke Timer', to: routes.KeystrokeTimerRoute.to },
  { name: 'File Upload (AWS S3)', to: routes.FileUploadRoute.to },
];
