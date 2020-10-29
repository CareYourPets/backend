DROP FUNCTION care_taker_insert_trigger_funct CASCADE;
DROP TRIGGER care_taker_insert_trigger ON care_takers CASCADE;
DROP FUNCTION create_pet_owner_notification_trigger_funct CASCADE;
DROP TRIGGER create_pet_owner_notification_trigger ON bids CASCADE;
DROP FUNCTION create_care_taker_notification_trigger_funct CASCADE;
DROP TRIGGER create_care_taker_notification_trigger ON bids CASCADE;
DROP FUNCTION update_pet_owner_notification_trigger_funct CASCADE;
DROP TRIGGER update_pet_owner_notification_trigger ON bids CASCADE;
DROP FUNCTION update_care_taker_notification_trigger_funct CASCADE;
DROP TRIGGER update_care_taker_notification_trigger ON bids CASCADE;

DROP TABLE pet_categories CASCADE;

DROP TABLE pet_owners CASCADE;
DROP TABLE psc_administrators CASCADE;
DROP TABLE care_takers CASCADE;
DROP TYPE gender_enum CASCADE;
DROP TABLE pets CASCADE;
DROP TABLE care_taker_skills CASCADE;
DROP TABLE care_taker_full_timers CASCADE;
DROP TABLE care_taker_part_timers CASCADE;
DROP FUNCTION calculate_duration CASCADE;
DROP TABLE bids CASCADE;
DROP TABLE pet_owner_notifications CASCADE;
DROP TABLE care_taker_notifications CASCADE;
