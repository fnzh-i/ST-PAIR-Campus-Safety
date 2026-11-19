export const ROLES = {
  security: { label: 'Security Personnel', short: 'Security', home: 'alerts', nav: [['alerts','Live Alerts'],['cameras','Assigned Cameras'],['shift','Shift Log'],['report','Encode Incident Report']] },
  administrator: { label: 'Administrator', short: 'Administrator', home: 'incidents', nav: [['alerts','Live Alerts · View Only'],['cameras','Cameras'],['incidents','Incident Log'],['analytics','Surveillance Analytics'],['approvals','Approvals & Audit Log']] },
  system: { label: 'System Administrator', short: 'System Admin', home: 'zones', nav: [['alerts','Live Alerts · View Only'],['cameras','Cameras & Zones'],['zones','Zones & Sensitivity'],['rules','Severity Rules'],['users','Users & Roles'],['retention','Retention & Audit Log']] },
  faculty: { label: 'Faculty', short: 'Faculty', home: 'zone-alerts', nav: [['zone-alerts','Zone Alerts'],['zone-summary','My Zone Summary'],['preferences','Notification Preferences']] },
  student: { label: 'Student', short: 'Student', home: 'urgent', nav: [['urgent','Urgent Alert'],['notice','Surveillance Notice']] }
};

export const incidents = [
  { id:'INC-2026-0142', title:'Armed Threat Incident', category:'Critical', severity:'High', zone:'A-4-Hallway-1', camera:'CAM-A4-H1', time:'10:42:13', date:'19 Nov 2026', confidence:'0.91', evidence:'Human ×2 · Firearm (pistol) · pointing_firearm', status:'New', verification:'Pending', report:'Not submitted' },
  { id:'INC-2026-0139', title:'Slip and Fall', category:'Medical', severity:'Medium', zone:'A-4-Classroom 401', camera:'CAM-A4-401', time:'09:15:31', date:'19 Nov 2026', confidence:'0.86', evidence:'Human ×1 · fall posture', status:'Resolved', verification:'Verified', report:'Submitted' },
  { id:'INC-2026-0137', title:'Physical Assault', category:'Physical', severity:'Medium', zone:'A-4-Hallway-1', camera:'CAM-A4-H1', time:'07:58:04', date:'19 Nov 2026', confidence:'0.74', evidence:'Human ×2 · aggressive movement', status:'False Alarm', verification:'Reviewed', report:'Submitted' },
  { id:'INC-2026-0132', title:'Physical Assault', category:'Physical', severity:'Medium', zone:'B-4-Classroom 402', camera:'CAM-B4-402', time:'16:22:09', date:'18 Nov 2026', confidence:'0.82', evidence:'Human ×2 · aggressive movement', status:'Resolved', verification:'Verified', report:'Submitted' }
];

export const cameras = [
  { id:'CAM-A4-H1', zone:'A-4-Hallway-1', place:'Academic Building A · Floor 4', status:'Live', mapping:'Calibrated' },
  { id:'CAM-A4-401', zone:'A-4-Classroom 401', place:'Academic Building A · Floor 4', status:'Live', mapping:'Calibrated' },
  { id:'CAM-B4-402', zone:'B-4-Classroom 402', place:'Science Building B · Floor 4', status:'Offline', mapping:'Calibrated' },
  { id:'CAM-B4-H2', zone:'B-4-Hallway-2', place:'Science Building B · Floor 4', status:'Live', mapping:'Needs mapping' }
];

export const zones = [
  { id:'A-4-Hallway-1', building:'A · Academic', floor:'4', sensitivity:'Semi-restricted', camera:'CAM-A4-H1', mapping:'Calibrated' },
  { id:'A-4-Classroom 401', building:'A · Academic', floor:'4', sensitivity:'Public', camera:'CAM-A4-401', mapping:'Calibrated' },
  { id:'B-4-Classroom 402', building:'B · Science', floor:'4', sensitivity:'Public', camera:'CAM-B4-402', mapping:'Calibrated' },
  { id:'B-4-Hallway-2', building:'B · Science', floor:'4', sensitivity:'Public', camera:'CAM-B4-H2', mapping:'Needs mapping' },
  { id:'C-1-Auditorium', building:'C · Admin', floor:'1', sensitivity:'Public', camera:'CAM-C1-AUD', mapping:'Calibrated' }
];

export function canAccess(role, screen) { return !!ROLES[role]?.nav.some(([key]) => key === screen); }
export function nextStatus(current, action) {
  const transitions = { New:{ acknowledge:'Acknowledged', falseAlarm:'False Alarm' }, Acknowledged:{ responding:'Responding', falseAlarm:'False Alarm' }, Responding:{ resolve:'Resolved', falseAlarm:'False Alarm' } };
  return transitions[current]?.[action] ?? null;
}
export function studentAlertAllowed(incident) { return incident.category === 'Critical' && incident.verification === 'Verified' && incident.severity === 'High'; }
export function validPolygon(points) {
  if (!Array.isArray(points) || points.length < 3 || points.some(([x,y]) => !Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100)) return false;
  let area = 0;
  for (let i=0; i<points.length; i++) { const [x1,y1]=points[i], [x2,y2]=points[(i+1)%points.length]; area += x1*y2-x2*y1; }
  return Math.abs(area) > 20;
}

export function createZoneChange(zone, input, id = Date.now()) {
  return {
    id,
    name: `${input.zoneId}: proposed zone configuration`,
    detail: `Camera ${input.camera} · requested now`,
    status: 'Pending',
    draft: {
      originalId: zone.id,
      values: {
        id: input.zoneId,
        camera: input.camera,
        building: input.building,
        floor: input.floor,
        sensitivity: zone.sensitivity
      }
    }
  };
}

export function createDraftZone(existingZones) {
  let number = 1;
  while (existingZones.some(zone => zone.id === `NEW-ZONE-${number}`)) number++;
  return { id:`NEW-ZONE-${number}`, building:'A · Academic', floor:'1', sensitivity:'Public', camera:'CAM-A4-H1', mapping:'Draft' };
}

export function createZoneRemoval(zone, id = Date.now()) {
  return { id, name:`Remove zone: ${zone.id}`, detail:`Camera ${zone.camera} · requested now`, status:'Pending', removeZoneId:zone.id };
}

export function removeZoneById(existingZones, id) {
  const index = existingZones.findIndex(zone => zone.id === id);
  if (index < 0) return false;
  existingZones.splice(index, 1);
  return true;
}
