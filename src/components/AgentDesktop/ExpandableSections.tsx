import React from "react";
import ExpandableSections from "@cloudscape-design/components/expandable-section";

// AllergyIntolerance Section
export const AllergyIntoleranceSection = () => (
  <ExpandableSections headerText="allergyintolerance">
    Here is a detailed technical summary of patient 1f528581-7613-2b96-dce3-68c7cf967ea1 from the provided medical data:
    <br /><br />
    Peanut (substance) allergy, clinical status: active, verification status: confirmed, category: food, criticality: low, onset date: 1989-04-09
    <br /><br />
    Manifestations: Allergic angioedema (moderate severity), Cough (mild), Diarrhea (mild), Wheal (moderate)
    <br /><br />
    Animal dander (substance) allergy, clinical status: active, verification status: confirmed, category: environment, criticality: low, onset date: 1989-04-09
    <br /><br />
    Manifestations: Wheal (mild), Eruption of skin (mild), Rhinoconjunctivitis (moderate)
    <br /><br />
    Mold (organism) allergy, clinical status: active, verification status: confirmed, category: environment, criticality: low, onset date: 1989-04-09
    <br /><br />
    Grass pollen (substance) allergy, clinical status: active, verification status: confirmed, category: environment, criticality: low, onset date: 1989-04-09
    <br /><br />
    Fish (substance) allergy, clinical status: active, verification status: confirmed, category: food, criticality: low, onset date: 1989-04-09
    <br /><br />
    Manifestations: Dyspnea (moderate), Rhinoconjunctivitis (mild)
    <br /><br />
    Bee venom (substance) allergy, clinical status: active, verification status: confirmed, category: environment, criticality: low, onset date: 1989-04-09
    <br /><br />
    Ibuprofen allergy, clinical status: active, verification status: confirmed, category: medication, criticality: low, onset date: 1989-04-09
    <br /><br />
    Manifestation: Itching (moderate)
    <br /><br />
    House dust mite (organism) allergy, clinical status: active, verification status: confirmed, category: environment, criticality: low, onset date: 1989-04-09
    <br /><br />
    Tree pollen (substance) allergy, clinical status: active, verification status: confirmed, category: environment, criticality: low, onset date: 1989-04-09.
  </ExpandableSections>
);

// Claim Section
export const ClaimSection = () => (
  <ExpandableSections headerText="claim">
    No information available.
  </ExpandableSections>
);

// MedicationRequest Section
export const MedicationRequestSection = () => (
  <ExpandableSections headerText="medicationrequest">
    The medical data provided contains the following relevant information for patient 1f528581-7613-2b96-dce3-68c7cf967ea1:
    <br /><br />
    Medication Request (stopped): Acetaminophen 325 MG Oral Tablet, ordered on 2020-09-16T16:31:14-07:00 by Dr. Lucas Angulo during Encounter 458785dc-ffb2-eb80-4b0c-2f21322a2069. Dosage instruction: Take as needed.
    <br /><br />
    Medication Request (active): Astemizole 10 MG Oral Tablet, ordered on 1989-04-09T15:37:15-07:00 by Dr. Lucas Angulo during Encounter 72171b26-a264-320d-859f-1976eb8bd85b. Dosage instruction: Take as needed.
    <br /><br />
    Medication Request (stopped): NuvaRing 0.12/0.015 MG per 24HR 21 Day Vaginal Ring, ordered on 2012-10-06T16:49:19-07:00 by Dr. Lucas Angulo during Encounter 15653d18-901b-0aa8-24e4-1793e9ec2bc4.
    <br /><br />
    Medication Request (active): NDA020800 0.3 ML Epinephrine 1 MG/ML Auto-Injector, ordered on 1989-04-09T15:37:15-07:00 by Dr. Lucas Angulo during Encounter 72171b26-a264-320d-859f-1976eb8bd85b. Dosage instruction: Take as needed.
  </ExpandableSections>
);

// Immunization Section
export const ImmunizationSection = () => (
  <ExpandableSections headerText="immunization">
    The medical data provided contains the following relevant information for patient 1f528581-7613-2b96-dce3-68c7cf967ea1:
    <br /><br />
    SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 30 mcg/0.3mL dose
    <br /><br />
    Administered on 2021-11-05 at COMMUNITY HOSPITAL OF HUNTINGTON PARK
    <br /><br />
    SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 30 mcg/0.3mL dose
    <br /><br />
    Administered on 2021-10-15 at COMMUNITY HOSPITAL OF HUNTINGTON PARK
    <br /><br />
    Td (adult) preservative free
    <br /><br />
    Administered on 2019-02-15 at LOS REYES CLIINICA MEDICA, INC
    <br /><br />
    Influenza, seasonal, injectable, preservative free
    <br /><br />
    Administered on 2022-02-18 at LOS REYES CLIINICA MEDICA, INC
    <br /><br />
    Administered on 2019-02-15 at LOS REYES CLIINICA MEDICA, INC
    <br /><br />
    Administered on 2016-02-12 at LOS REYES CLIINICA MEDICA, INC
    <br /><br />
    Administered on 2013-02-08 at LOS REYES CLIINICA MEDICA, INC
    <br /><br />
    The data provides information about the immunizations received by the patient, including the vaccine codes, administration dates, and locations where the immunizations were given.
  </ExpandableSections>
);

// FamilyMemberHistory Section
export const FamilyMemberHistorySection = () => (
  <ExpandableSections headerText="familymemberhistory">
    No information available.
  </ExpandableSections>
);

// Conditions Section
export const ConditionsSection = () => (
  <ExpandableSections headerText="conditions">
    According to the medical record, the patient 1f528581-7613-2b96-dce3-68c7cf967ea1 has the following conditions:
    <br /><br />
    Part-time employment
    <br /><br />
    Housing unsatisfactory
    <br /><br />
    Stress
    <br /><br />
    Full-time employment
    <br /><br />
    Victim of intimate partner abuse
    <br /><br />
    Unhealthy alcohol drinking behavior
    <br /><br />
    Received higher education
    <br /><br />
    Obesity (Body mass index 30+)
    <br /><br />
    Social isolation
    <br /><br />
    Limited social contact
    <br /><br />
    Facial laceration
    <br /><br />
    The record provides details on the status (active, resolved) and time periods for many of these conditions.
  </ExpandableSections>
);
