import test from 'node:test';
import assert from 'node:assert/strict';
import { ROLES, canAccess, nextStatus, studentAlertAllowed, validPolygon, createZoneChange } from './domain.js';

test('Security response follows the approved lifecycle and closed records cannot reopen', () => {
  assert.equal(nextStatus('New','acknowledge'),'Acknowledged');
  assert.equal(nextStatus('Acknowledged','responding'),'Responding');
  assert.equal(nextStatus('Responding','resolve'),'Resolved');
  assert.equal(nextStatus('Resolved','acknowledge'),null);
  assert.equal(nextStatus('New','resolve'),null);
});

test('restricted role navigation keeps historical evidence out of Security, Faculty and Student views', () => {
  assert.equal(canAccess('security','incidents'),false);
  assert.equal(canAccess('security','analytics'),false);
  assert.equal(canAccess('faculty','cameras'),false);
  assert.equal(canAccess('student','incidents'),false);
  assert.equal(canAccess('administrator','incidents'),true);
  assert.equal(ROLES.student.nav.some(([key])=>key==='cameras'),false);
});

test('student routing requires verified, high-severity critical events', () => {
  const event={category:'Critical',severity:'High',verification:'Verified'};
  assert.equal(studentAlertAllowed(event),true);
  assert.equal(studentAlertAllowed({...event,verification:'Pending'}),false);
  assert.equal(studentAlertAllowed({...event,category:'Physical'}),false);
  assert.equal(studentAlertAllowed({...event,severity:'Medium'}),false);
});

test('zone geometry rejects empty, collapsed and out-of-frame polygons', () => {
  assert.equal(validPolygon([[10,10],[80,10],[80,80],[10,80]]),true);
  assert.equal(validPolygon([[10,10],[20,20],[30,30]]),false);
  assert.equal(validPolygon([[10,10],[20,10]]),false);
  assert.equal(validPolygon([[10,10],[120,10],[80,80]]),false);
});

test('submitting a zone edit preserves its existing sensitivity', () => {
  const zone = { id:'A-4-Hallway-1', sensitivity:'Semi-restricted' };
  const change = createZoneChange(zone, { zoneId:'A-4-Hallway-1', camera:'CAM-A4-401', building:'A · Academic', floor:'4' }, 7);
  assert.equal(change.status, 'Pending');
  assert.equal(change.draft.values.sensitivity, 'Semi-restricted');
  assert.equal(change.detail.includes('Semi-restricted'), false);
});
