import cliProgress from 'cli-progress';
import * as fs from 'fs';
import path from 'path';
import * as util from 'util';
import { Martyrology } from '../catalog/martyrology';
import { CalendarScope } from '../constants/calendar-scope';
import { LiturgicalColors } from '../constants/colors';
import { ProperCycles } from '../constants/cycles';
import { PROPER_OF_TIME_NAME } from '../constants/general-calendar-names';
import { CanonizationLevel, PatronTitles, Titles } from '../constants/martyrology-metadata';
import { LiturgicalPeriods } from '../constants/periods';
import { Precedences } from '../constants/precedences';
import { LiturgicalSeasons } from '../constants/seasons';
import { GeneralRoman } from '../general-calendar/proper-of-saints';
import { locales } from '../locales';
import { RomcalBundle } from '../models/bundle';
import { CalendarDef } from '../models/calendar-def';
import { RomcalConfig } from '../models/config';
import LiturgicalDayDef from '../models/liturgical-day-def';
import { particularCalendars } from '../particular-calendars';
import { BundleDefinitions, LiturgicalDayDefinitions } from '../types/calendar-def';
import { RomcalConfigOutput } from '../types/config';
import { Locale, LocaleLiturgicalDayNames } from '../types/locale';
import { MartyrologyCatalog } from '../types/martyrology';
import { mergeDeep } from '../utils/objects';

/**
 * Class helper, used to build the localized calendar bundles.
 */
class RomcalBuilder {
  readonly #config: RomcalConfig;
  #martyrologyKeys: string[] = [];

  constructor(locale: Locale, particularCalendar?: typeof CalendarDef) {
    const scope = { scope: CalendarScope.Liturgical };
    this.#config = new RomcalConfig(scope, Martyrology.catalog, locale, particularCalendar);
  }

  get martyrologyKeys(): string[] {
    return this.#martyrologyKeys;
  }

  get config(): RomcalConfigOutput {
    return this.#config.toObject();
  }

  calendarConstructorName(): string {
    const calendarDefs = this.#config.calendarsDef;
    return calendarDefs[calendarDefs.length - 1].constructor.name;
  }

  getCalendarName(): string {
    const calendarDefs = this.#config.calendarsDef;
    return calendarDefs[calendarDefs.length - 1].calendarName;
  }

  getOutputFilename(): string {
    const calendarDefs = this.#config.calendarsDef;
    const currentCalendarName: string = calendarDefs[calendarDefs.length - 1].calendarName
      .replace('__', '.')
      .replace('_', '-');
    return `${currentCalendarName}.${this.#config.localeKey}.ts`;
  }

  getAllInputs(): LiturgicalDayDefinitions {
    this.#config.calendarsDef.forEach((cal) => cal.buildAllDefinitions());
    return this.#config.liturgicalDayDef;
  }

  getAllDefinitions(): BundleDefinitions {
    return Object.values(this.#config.liturgicalDayDef).reduce(
      (obj: BundleDefinitions, def: LiturgicalDayDef) => {
        if (def.fromCalendar === PROPER_OF_TIME_NAME) return obj;

        obj[def.key] = def.input;

        // Retrieve martyrology keys
        const martyrologyKeys: string[] = this.#martyrologyKeys.concat(
          def.input.flatMap(
            (i) =>
              i.martyrology?.flatMap((m) => (typeof m === 'string' ? m : m.key)) ??
              (Martyrology.catalog[def.key] ? [def.key] : []) ??
              [],
          ),
        );

        // Remove duplicates and save the martyrology keys
        this.#martyrologyKeys = [...new Set(martyrologyKeys)];

        return obj;
      },
      {},
    );
  }
}

const RomcalBundler = () => {
  const gauge = new cliProgress.SingleBar(
    {
      format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {filename}',
      hideCursor: true,
      clearOnComplete: true,
    },
    cliProgress.Presets.shades_classic,
  );
  const allCalendars: typeof CalendarDef[] = [GeneralRoman, ...Object.values(particularCalendars)];
  const allLocaleKeys = Object.keys(locales);

  console.log('Building romcal calendar bundles…');
  gauge.start(allCalendars.length * allLocaleKeys.length - 1, 0);
  let gaugeCount = 0;

  for (let i = 0; i < allCalendars.length; i++) {
    const calendar = allCalendars[i];
    for (let j = 0; j < allLocaleKeys.length; j++) {
      const locale = locales[allLocaleKeys[j]];

      // Init config
      const isGRC = calendar.name === GeneralRoman.name;
      const builder = isGRC ? new RomcalBuilder(locale) : new RomcalBuilder(locale, calendar);

      // Init calendars
      const filename = builder.getOutputFilename();
      const calendarConstructorName = builder.calendarConstructorName();
      const calendarName = builder.getCalendarName();

      // Provide CLI feedback
      gauge.update(gaugeCount++, { filename });
      if (process.env['CI'] && j === 0) console.log('- ' + calendarName);

      // Build and get definitions & martyrology items
      const inputs = builder.getAllInputs();
      const definitions = builder.getAllDefinitions();
      const martyrologyKeys = builder.martyrologyKeys;

      // Merge the current locale with the default English locale
      const mergedLocale = mergeDeep(locales.en, locale);

      // Extract required liturgical names
      const names = Object.values(inputs)
        .filter((def) => def.i18nDef[0].startsWith('names:'))
        .map((def) => def.i18nDef[0].substr(6))
        .reduce((obj: LocaleLiturgicalDayNames, key: string) => {
          if (locale.names && Object.prototype.hasOwnProperty.call(locale.names, key)) {
            obj[key] = locale.names[key];
          } else if (
            locales.en.names &&
            Object.prototype.hasOwnProperty.call(locales.en.names, key)
          ) {
            obj[key] = locales.en.names[key];
          } else {
            throw new Error(
              `Locale key 'names:${key}' is missing in the calendar '${calendar.name}'.`,
            );
          }
          return obj;
        }, {});

      // Extract martyrology items
      const martyrology: MartyrologyCatalog = Object.fromEntries(
        Object.entries(Martyrology.catalog)
          .filter(([key]) => martyrologyKeys.includes(key))
          .map(([key, data]) => [
            key,
            (() => {
              // Extract the 'name' property since it's deprecated in the item definition.
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { name, ...martyrologyData } = data;
              return martyrologyData;
            })(),
          ]),
      );

      // Create a romcal bundle object
      const bundle = new RomcalBundle({
        calendarName,
        particularConfig: {
          epiphanyOnSunday: builder.config.epiphanyOnSunday,
          ascensionOnSunday: builder.config.ascensionOnSunday,
          corpusChristiOnSunday: builder.config.corpusChristiOnSunday,
        },
        definitions,
        martyrology,
        i18n: {
          key: locale.key,
          colors: mergedLocale.colors,
          months: mergedLocale.months,
          ordinals: mergedLocale.ordinals,
          periods: mergedLocale.periods,
          ranks: mergedLocale.ranks,
          seasons: mergedLocale.seasons,
          weekdays: mergedLocale.weekdays,
          names,
        },
      });

      // Prepare the bundled calendars file content.
      const dir = path.resolve(__dirname, '../../tmp/bundles/');
      const calVarName = `${calendarConstructorName}_${locale.key
        // Locale key to UpperCamelCase
        .replace(/(^.)/, (k: string) => k.toUpperCase())
        .replace(/(-\w)/g, (k: string) => k[1].toUpperCase())}`;
      let jsOutput = util
        .inspect(bundle, false, 99)
        .replace(/^RomcalBundle\s/, '')
        .replace(/(\n\s*\S+:\sundefined,)/gi, '')
        .replace(/\n\s*(!:seasons|periods)\s:\[],/gi, '');

      // Replace string values by the corresponding constant objects.
      const stringToObj = {
        CanonizationLevel: CanonizationLevel,
        LiturgicalColors: LiturgicalColors,
        LiturgicalPeriods: LiturgicalPeriods,
        LiturgicalSeasons: LiturgicalSeasons,
        Titles: Titles,
        Precedences: Precedences,
        PatronTitles: PatronTitles,
        ProperCycles: ProperCycles,
      };
      Object.entries(stringToObj).forEach(([objName, obj]) => {
        Object.entries(obj).forEach(([key, value]) => {
          jsOutput = jsOutput.replace(new RegExp(`'${value}'`, 'g'), `${objName}.${key}`);
        });
      });

      // Append imports inside the bundle file.
      jsOutput =
        `/* eslint-disable */\n` +
        `import {\n  CanonizationLevel,\n  LiturgicalColors,\n  LiturgicalPeriods,\n  LiturgicalSeasons,\n  PatronTitles,\n  Precedences,\n  ProperCycles,\n  RomcalBundleObject,\n  Titles,\n} from '../../lib/index';\n\n` +
        `export const ${calVarName}: RomcalBundleObject = ${jsOutput}`;

      // Write the calendar bundle file.
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.resolve(dir, filename), jsOutput, 'utf-8');
    }
  }

  gauge.stop();
  console.log(
    `${allCalendars.length} calendars in ${allLocaleKeys.length} locales built in the /tmp/bundles/ directory.`,
  );
};

RomcalBundler();
