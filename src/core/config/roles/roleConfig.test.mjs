import test from "node:test";
import assert from "node:assert/strict";
import { roleConfig, roleKeyFromRoleId } from "./roleConfig.js";

test("the search bar is hidden for every role", () => {
  for (const role of ["student", "driver", "father"]) {
    assert.ok(
      !("showSearchInput" in roleConfig[role].topBar),
      `${role} must not declare showSearchInput`,
    );
  }
});

test("the family card is hidden only for the driver role", () => {
  assert.equal(roleConfig.student.profile.showFamily, true);
  assert.equal(roleConfig.father.profile.showFamily, true);
  assert.equal(roleConfig.driver.profile.showFamily, false);
});

test("the QR is available only for the student and driver roles", () => {
  assert.equal(roleConfig.student.card.showQR, true);
  assert.equal(roleConfig.driver.card.showQR, true);
  assert.equal(roleConfig.father.card.showQR, false);
});

test("the incident report button is available only for the driver role", () => {
  assert.equal(roleConfig.driver.card.showIncidentReport, true);
  assert.equal(roleConfig.student.card.showIncidentReport, false);
  assert.equal(roleConfig.father.card.showIncidentReport, false);
});

test("the JWT roleId maps to its roleConfig key, defaulting to student", () => {
  assert.equal(roleKeyFromRoleId(2), "student");
  assert.equal(roleKeyFromRoleId(3), "driver");
  assert.equal(roleKeyFromRoleId(4), "father");
  assert.equal(roleKeyFromRoleId(null), "student");
});

test("the student shows its QR and the driver scans it", () => {
  assert.equal(roleConfig.student.card.qrMode, "activate");
  assert.equal(roleConfig.driver.card.qrMode, "scan");
  assert.equal(roleConfig.father.card.qrMode, null);
});
