import { NgZone } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

NgZone.assertInAngularZone = () => {};

bootstrapApplication(AppComponent, appConfig);
