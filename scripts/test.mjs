import test from 'node:test';import assert from 'node:assert/strict';
import {duration,monthDates,monday,hours,escapeHtml,csvCell} from '../assets/core.mjs';
test('actual attendance uses two disjoint intervals, never the school gap',()=>{assert.deepEqual(duration('07:30','08:30','16:30','18:00'),{total:150});assert.equal(hours(150),'2 h 30');});
test('incomplete, overlapping and reversed hours are rejected',()=>{for(const args of [['08:00',''],['17:00','08:00'],['08:00','12:00','11:00','13:00'],['25:00','26:00']])assert.ok(duration(...args).error);assert.deepEqual(duration('','','',''),{total:0});});
test('calendar covers leap years and year boundary without local timezone drift',()=>{assert.equal(monthDates('2024-02').length,29);assert.equal(monthDates('2026-02').length,28);assert.equal(monthDates('2026-13').length,0);assert.equal(monday('2027-01-01').toISOString().slice(0,10),'2026-12-28');});
test('untrusted content is escaped in HTML and CSV formulas are neutralized',()=>{assert.equal(escapeHtml('<img src=x>'),'&lt;img src=x&gt;');assert.equal(csvCell('=1+1'),'"\'=1+1"');assert.equal(csvCell('Mia;"'),'"Mia;"""');});
