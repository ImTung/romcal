import { BaseRomcalBundle } from '../types/bundle';
import { BundleDefinitions, ParticularConfig } from '../types/calendar-def';
import { Key } from '../types/common';
import { Locale } from '../types/locale';
import { MartyrologyCatalog } from '../types/martyrology';

export class RomcalBundle implements BaseRomcalBundle {
  calendarName: Key;
  particularConfig: ParticularConfig;
  definitions: BundleDefinitions;
  martyrology: MartyrologyCatalog;
  i18n: Locale;

  constructor(input: BaseRomcalBundle) {
    this.calendarName = input.calendarName;
    this.particularConfig = input.particularConfig;
    this.definitions = input.definitions;
    this.martyrology = input.martyrology;
    this.i18n = input.i18n;
  }
}