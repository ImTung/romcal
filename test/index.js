var should = require('should'),
    romcal = require('../romcal'),
    lodash = require('lodash'),
	moment = require('moment');

describe('romcal', function() {
    describe('calendarFor(): no arguments', function() {
        it('returns an array of current year dates of either 365 or 366 days', function( done ) {
            romcal.calendarFor( function( dates ) {            
                dates.length.should.be.greaterThan(364);
                dates.length.should.be.lessThan(367);
                done();
            });
        });
    });
    describe('calendarFor("2008"): get all dates in the Gregorian year 2008', function() {
        it('returns an array of 2008 dates', function( done ) {
            romcal.calendarFor('2008', function( dates ) {
                lodash.map( dates, function( v, k ) {
                    v.moment.year().should.be.eql(2008);
                });
                done();
            });
        });
    });
    describe('queryFor("january", dates ): query all dates in January 2012', function() {
        it('returns an array of dates in January 2012 with length 31', function( done ) {
            romcal.calendarFor('2012', function( dates ) {
                romcal.queryFor('january', dates, function( query ) {
                    lodash.map( query, function( v, k ) {
                        v.moment.month().should.be.eql(0);
                    });
                    query.length.should.be.eql(31);
                    done();
                });
            });
        });
    });
    describe('queryFor("mondays", dates ): query all dates that are Mondays in 2013', function() {
        it('returns an array of dates falling on Monday in 2013', function( done ) {
            romcal.calendarFor('2013', function( dates ) {
                romcal.queryFor('mondays', dates, function( query ) {
                    lodash.map( query, function( v, k ) {
                        v.moment.day().should.be.eql(1);
                    });
                    done();
                });
            });
        });
    });
    describe('queryFor("solemnities", dates ): query all dates that are Solemnities in 2009', function() {
        it('returns an array of dates that are Solemnities in 2009', function( done ) {
            var dates = romcal.calendarFor('2009', function( dates ) {
                romcal.queryFor('solemnities', dates, function( query ) {
                    lodash.map( query, function( v, k ) {
                        v.type.id.should.be.eql('SOLEMNITY');
                    });
                    done();
                });
            });
        });
    });
});