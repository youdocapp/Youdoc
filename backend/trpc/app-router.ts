import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { getProfileProcedure } from "./routes/profile/get-profile/route";
import { updateProfileProcedure } from "./routes/profile/update-profile/route";
import { getMedicationsProcedure } from "./routes/medications/get-medications/route";
import { addMedicationProcedure } from "./routes/medications/add-medication/route";
import { updateMedicationProcedure } from "./routes/medications/update-medication/route";
import { deleteMedicationProcedure } from "./routes/medications/delete-medication/route";
import { getHealthRecordsProcedure } from "./routes/health-records/get-health-records/route";
import { addHealthRecordProcedure } from "./routes/health-records/add-health-record/route";
import { getEmergencyContactsProcedure } from "./routes/emergency-contacts/get-emergency-contacts/route";
import { addEmergencyContactProcedure } from "./routes/emergency-contacts/add-emergency-contact/route";
import { updateEmergencyContactProcedure } from "./routes/emergency-contacts/update-emergency-contact/route";
import { deleteEmergencyContactProcedure } from "./routes/emergency-contacts/delete-emergency-contact/route";
import { getMedicalConditionsProcedure } from "./routes/medical-history/get-medical-conditions/route";
import { addMedicalConditionProcedure } from "./routes/medical-history/add-medical-condition/route";
import { getAllergiesProcedure } from "./routes/medical-history/get-allergies/route";
import { addAllergyProcedure } from "./routes/medical-history/add-allergy/route";
import { getSurgeriesProcedure } from "./routes/medical-history/get-surgeries/route";
import { addSurgeryProcedure } from "./routes/medical-history/add-surgery/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  profile: createTRPCRouter({
    get: getProfileProcedure,
    update: updateProfileProcedure,
  }),
  medications: createTRPCRouter({
    getAll: getMedicationsProcedure,
    add: addMedicationProcedure,
    update: updateMedicationProcedure,
    delete: deleteMedicationProcedure,
  }),
  healthRecords: createTRPCRouter({
    getAll: getHealthRecordsProcedure,
    add: addHealthRecordProcedure,
  }),
  emergencyContacts: createTRPCRouter({
    getAll: getEmergencyContactsProcedure,
    add: addEmergencyContactProcedure,
    update: updateEmergencyContactProcedure,
    delete: deleteEmergencyContactProcedure,
  }),
  medicalHistory: createTRPCRouter({
    getConditions: getMedicalConditionsProcedure,
    addCondition: addMedicalConditionProcedure,
    getAllergies: getAllergiesProcedure,
    addAllergy: addAllergyProcedure,
    getSurgeries: getSurgeriesProcedure,
    addSurgery: addSurgeryProcedure,
  }),
});

export type AppRouter = typeof appRouter;
