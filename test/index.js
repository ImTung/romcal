/*
    The MIT License (MIT)

    Copyright (c) 2014 Pereira, Julian Matthew

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

var should = require('should'),
    romcal = require('../romcal'),
    lodash = require('lodash'),
	moment = require('moment');

describe('romcal', function() {
    describe('calendarFor(): no arguments', function() {
        it('returns an array of current year dates of either 365 or 366 days', function( done ) {
            romcal.calendarFor( function( err, dates ) {
                if ( err ) {
                    throw new Error( err );
                    done();
                }
                // lodash.map( dates, function( v, k ) {
                //     console.log( v.moment.format('dddd, MMMM Do YYYY'), ':', v.type.name, ':', v.color.name, ':', v.name, ':', ( lodash.isUndefined( v.data.psalterWeek ) ? '' : v.data.psalterWeek ) );
                // });
                dates.length.should.be.greaterThan(364);
                dates.length.should.be.lessThan(367);
                done();
            });
        });
    });
    // describe('calendarFor("2007"): get all dates in the Gregorian year 2008', function() {
    //     it('returns an array of 2007 dates', function( done ) {
    //         romcal.calendarFor('2007', function( err, dates ) {
    //             lodash.map( dates, function( v, k ) {
    //                 if ( err ) {
    //                     throw new Error( err );
    //                     done();
    //                 }
    //                 v.moment.year().should.be.eql(2007);
    //             });
    //             done();
    //         });
    //     });
    // });
    // describe('Get all other celebrations in 2014', function() {
    //     it('Returns an array of other celebrations in 2014', function( done ) {
    //         romcal.calendarFor( function( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             romcal.queryFor('otherCelebrations', dates, function( errz, query ) {
    //                 lodash.map( query, function( v, k ) {
    //                     if ( err ) {
    //                         throw new Error( err );
    //                         done();
    //                     };
    //                     console.log( v.moment.format('dddd, MMMM Do YYYY'), ':', v.type.name, ':', v.color.name, ':', v.name );
    //                 });
    //             });
    //             done();
    //         });
    //     });
    // });
    // describe('queryNationalCalendar("2008", "es-AR", "argentina"): get the Argentinian National Calendar, locale es-AR for 2008', function() {
    //     it('returns an array of dates for the Argentinian National Calendar, 2008', function( done ) {
    //         romcal.queryNationalCalendar('2008', 'es-AR', 'argentina', function ( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             dates.length.should.be.greaterThan(364);
    //             dates.length.should.be.lessThan(367);
    //             lodash.map( dates, function( v, k ) {
    //                 v.moment.year().should.be.eql(2008);
    //             });
    //             done();
    //         });
    //     });
    // });
    // describe('queryNationalCalendar("2008", "en-US", "unitedStates"): get the National Calendar of the US, locale en-US for 2008', function() {
    //     it('returns an array of dates for the National Calendar for the US, 2008', function( done ) {
    //         romcal.queryNationalCalendar('2008', 'en-US', 'unitedStates', function ( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             dates.length.should.be.greaterThan(364);
    //             dates.length.should.be.lessThan(367);
    //             lodash.map( dates, function( v, k ) {
    //                 // console.log( v.moment.toString(), ':', v.name, '-', v.type.name );
    //                 v.moment.year().should.be.eql(2008);
    //             });
    //             done();
    //         });
    //     });
    // });
    // describe('Query Thursdays in the US National Calendar, locale en-US for 2008', function() {
    //     it('returns an array of Thursdays for the US National Calendar, locale en-US, 2008', function( done ) {
    //         romcal.queryNationalCalendar('2008', 'en-US', 'unitedStates', function ( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             romcal.queryFor('saturdays', dates, function( errz, query ) {
    //                 if ( errz ) {
    //                     throw new Error( errz );
    //                     done();
    //                 }
    //                 lodash.map( query, function( v, k ) {
    //                     if ( errz ) throw new Error( errz );
    //                     // console.log( v.moment.toString(), ':', v.name, '-', v.type.name );
    //                     v.moment.day().should.be.eql(6);
    //                 });
    //                 done(); 
    //             });              
    //         });
    //     });
    // });
    // describe('queryFor("january", dates ): query all dates in January 2012', function() {
    //     it('returns an array of dates in January 2012 with length 31', function( done ) {
    //         romcal.calendarFor('2012', function( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             romcal.queryFor('january', dates, function( errz, query ) {
    //                 if ( errz ) {
    //                     throw new Error( errz );
    //                     done();
    //                 }
    //                 lodash.map( query, function( v, k ) {
    //                     v.moment.month().should.be.eql(0);
    //                 });
    //                 query.length.should.be.eql(31);
    //                 done();
    //             });
    //         });
    //     });
    // });
    // describe('queryFor("mondays", dates ): query all dates that are Mondays in 2013', function() {
    //     it('returns an array of dates falling on Monday in 2013', function( done ) {
    //         romcal.calendarFor('2013', function( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             romcal.queryFor('mondays', dates, function( errz, query ) {
    //                 if ( errz ) {
    //                     throw new Error( errz );
    //                     done();
    //                 }
    //                 lodash.map( query, function( v, k ) {
    //                     v.moment.day().should.be.eql(1);
    //                 });
    //                 done();
    //             });
    //         });
    //     });
    // });
    // describe('queryFor("solemnities", dates ): query all dates that are Solemnities in 2009', function() {
    //     it('returns an array of dates that are Solemnities in 2009', function( done ) {
    //         var dates = romcal.calendarFor('2009', function( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             romcal.queryFor('solemnities', dates, function( errz, query ) {
    //                 if ( errz ) {
    //                     throw new Error( errz );
    //                     done();
    //                 }
    //                 lodash.map( query, function( v, k ) {
    //                     v.type.id.should.be.eql('SOLEMNITY');
    //                 });
    //                 done();
    //             });
    //         });
    //     });
    // });
    // describe('queryFor("holyweek", dates ): query all dates that are within Holy Week, 2011', function() {
    //     it('returns an array of dates that are within Holy Week, 2011', function( done ) {
    //         var dates = romcal.calendarFor('2011', function( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             romcal.queryFor('holyWeek', dates, function( errz, query ) {
    //                 if ( errz ) {
    //                     throw new Error( errz );
    //                     done();
    //                 }
    //                 lodash.map( query, function( v, k ) {
    //                     v.data.season.should.be.eql('HolyWeek');
    //                 });
    //                 done();
    //             });
    //         });
    //     });
    // });
    // describe('get the liturgical cycle for Christmas 2013', function() {
    //     it('liturgical cycle for Christmas 2013 should be A (Cycle I)', function( done ) {
    //         var dates = romcal.calendarFor('2013', function( err, dates ) {
    //             if ( err ) {
    //                 throw new Error( err );
    //                 done();
    //             }
    //             romcal.queryFor('christmastide', dates, function( errz, query ) {
    //                 if ( errz ) {
    //                     throw new Error( errz );
    //                     done();
    //                 }

    //                 lodash.map( query, function( v, k ) {
    //                     if ( v.moment.date() === 25 ) {                
    //                         romcal.queryFor('liturgicalCycle', v, function( er, query ) {
    //                             if ( er ) {
    //                                 throw new Error( er );
    //                                 done();
    //                             }
    //                             query.id.should.be.equal('A');
    //                             done();
    //                         });
    //                         return;
    //                     }
    //                 });

    //             });
    //         });
    //     });
    // });
});