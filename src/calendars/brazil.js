import moment from 'moment';
import range from 'moment-range';
import _ from 'lodash';

import { Dates, Utils } from '../lib';
import { Titles, Types, LiturgicalColors } from '../constants';

let _dates = [
  {
    "key": "saintJoseDeAnchietaPriest",
    "type": Types[5],
    "moment": moment.utc({ year: arguments[0], month: 5, day: 9 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.WHITE
      }
    }
  },
  {
    "key": "blessedAlbertinaBerkenbrockVirginAndMartyr",
    "type": Types[5],
    "moment": moment.utc({ year: arguments[0], month: 5, day: 15 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.RED,
        "titles": [
          Titles.MARTYR
        ]
      }
    }
  },
  {
    "key": "saintPaulinaOfTheAgonizingHeartOfJesusVirgin",
    "type": Types[5],
    "moment": moment.utc({ year: arguments[0], month: 6, day: 9 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.WHITE
      }
    }
  },
  {
    "key": "ourLadyOfMountCarmel",
    "type": Types[4],
    "moment": moment.utc({ year: arguments[0], month: 6, day: 16 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.WHITE
      }
    }
  },
  {
    "key": "blessedInacioDeAzevedoPriestAndMartyr",
    "type": Types[5],
    "moment": moment.utc({ year: arguments[0], month: 6, day: 17 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.RED,
        "titles": [
          Titles.MARTYR
        ]
      }
    }
  },
  {
    "key": "saintRoseOfLimaVirgin",
    "type": Types[4],
    "moment": moment.utc({ year: arguments[0], month: 7, day: 23 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.WHITE
      }
    }
  },
  {
    "key": "blessedsAndreDeSoveralAndAmbrosioFranciscoFerroPriestsAndMartyrs",
    "type": Types[5],
    "moment": moment.utc({ year: arguments[0], month: 9, day: 3 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.RED,
        "titles": [
          Titles.RED
        ]
      }
    }
  },
  {
    "key": "ourLadyOfAparecidaNossaSenhoraAparecidaPatronessOfBrazil",
    "type": Types[0],
    "moment": moment.utc({ year: arguments[0], month: 9, day: 12 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.WHITE
      }
    }
  },
  {
    "key": "saintAnthonyOfSaintAnneGalvaoFreiGalvaoPriest",
    "type": Types[5],
    "moment": moment.utc({ year: arguments[0], month: 9, day: 25 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.WHITE
      }
    }
  },
  {
    "key": "saintsRoqueGonzalezAlfonsoRodriguezOlmedoAndJuanDelCastilloPriestsAndMartyrs",
    "type": Types[5],
    "moment": moment.utc({ year: arguments[0], month: 10, day: 19 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.RED,
        "titles": [
          Titles.RED
        ]
      }
    }
  },
  {
    "key": "ourLadyOfGuadalupe",
    "type": Types[4],
    "moment": moment.utc({ year: arguments[0], month: 11, day: 12 }),
    "data": {
      "meta": {
        "liturgicalColor": LiturgicalColors.WHITE
      }
    }
  }
];

let dates = () => {
  // Get localized celebration names
  return _.map( _dates, date => {
    date.name = Utils.localize({
      key: 'national.' + date.key
    });
    return date;
  });
};

export {
  dates 
};
