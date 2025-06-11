<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250611053908 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy DROP FOREIGN KEY FK_CBB142B56B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy ADD CONSTRAINT FK_CBB142B56B899279 FOREIGN KEY (patient_id) REFERENCES patient (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE consultation RENAME INDEX fk_consultation_patient TO IDX_964685A66B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease DROP FOREIGN KEY fk_disease_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease ADD CONSTRAINT FK_F3B6AC16B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease RENAME INDEX fk_disease_patient TO IDX_F3B6AC16B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor CHANGE created_at created_at DATETIME NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL, CHANGE roles roles JSON NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor RENAME INDEX email TO UNIQ_1FC0F36AE7927C74
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ecg_measurements DROP FOREIGN KEY ecg_measurements_ibfk_1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ecg_measurements CHANGE created_at created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', CHANGE waveforms waveforms JSON NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ecg_measurements ADD CONSTRAINT FK_314D3ABD6B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ecg_measurements RENAME INDEX patient_id TO IDX_314D3ABD6B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE humidity_measurements DROP FOREIGN KEY humidity_measurements_ibfk_1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE humidity_measurements CHANGE created_at created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE humidity_measurements ADD CONSTRAINT FK_A88BDE156B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE humidity_measurements RENAME INDEX patient_id TO IDX_A88BDE156B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication DROP FOREIGN KEY fk_medication_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication ADD CONSTRAINT FK_5AEE5B706B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication RENAME INDEX fk_medication_patient TO IDX_5AEE5B706B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient CHANGE valid_account valid_account TINYINT(1) DEFAULT 1 NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX email TO UNIQ_1ADAD7EBE7927C74
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX cnp TO UNIQ_1ADAD7EB1EAB9B7E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient_user MODIFY id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient_user DROP FOREIGN KEY fk_patient_user_patient
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX uniq_patient_user_patient ON patient_user
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX `primary` ON patient_user
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient_user DROP id, CHANGE patient_id patient_id INT AUTO_INCREMENT NOT NULL, CHANGE roles roles JSON NOT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE is_active is_active TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient_user ADD PRIMARY KEY (patient_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient_user RENAME INDEX email TO UNIQ_4029B81E7927C74
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pulse_measurements DROP FOREIGN KEY pulse_measurements_ibfk_1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pulse_measurements CHANGE created_at created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pulse_measurements ADD CONSTRAINT FK_9BE85D2E6B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pulse_measurements RENAME INDEX patient_id TO IDX_9BE85D2E6B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE recommendation CHANGE additional_notes additional_notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE recommendation RENAME INDEX fk_recommendation_patient TO IDX_433224D26B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sensor_alert_threshold CHANGE patient_id patient_id INT NOT NULL, CHANGE parameter parameter VARCHAR(32) NOT NULL, CHANGE message message VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sensor_alert_threshold RENAME INDEX fk_sensor_threshold_patient TO IDX_13413D7B6B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE temperature_measurements DROP FOREIGN KEY temperature_measurements_ibfk_1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE temperature_measurements CHANGE created_at created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE temperature_measurements ADD CONSTRAINT FK_5987B4D76B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE temperature_measurements RENAME INDEX patient_id TO IDX_5987B4D76B899279
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy DROP FOREIGN KEY FK_CBB142B56B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy ADD CONSTRAINT FK_CBB142B56B899279 FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE consultation RENAME INDEX idx_964685a66b899279 TO fk_consultation_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease DROP FOREIGN KEY FK_F3B6AC16B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease ADD CONSTRAINT fk_disease_patient FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease RENAME INDEX idx_f3b6ac16b899279 TO fk_disease_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor CHANGE is_active is_active TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE roles roles JSON DEFAULT 'json_array(_utf8mb4\\''ROLE_DOCTOR\\'')' NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor RENAME INDEX uniq_1fc0f36ae7927c74 TO email
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ecg_measurements DROP FOREIGN KEY FK_314D3ABD6B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ecg_measurements CHANGE waveforms waveforms JSON DEFAULT '_utf8mb4\\''[]\\''' NOT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ecg_measurements ADD CONSTRAINT ecg_measurements_ibfk_1 FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE ecg_measurements RENAME INDEX idx_314d3abd6b899279 TO patient_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE humidity_measurements DROP FOREIGN KEY FK_A88BDE156B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE humidity_measurements CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE humidity_measurements ADD CONSTRAINT humidity_measurements_ibfk_1 FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE humidity_measurements RENAME INDEX idx_a88bde156b899279 TO patient_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication DROP FOREIGN KEY FK_5AEE5B706B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication ADD CONSTRAINT fk_medication_patient FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication RENAME INDEX idx_5aee5b706b899279 TO fk_medication_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient CHANGE valid_account valid_account TINYINT(1) DEFAULT 1, CHANGE is_active is_active TINYINT(1) DEFAULT 1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX uniq_1adad7ebe7927c74 TO email
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX uniq_1adad7eb1eab9b7e TO cnp
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient_user ADD id INT AUTO_INCREMENT NOT NULL, CHANGE patient_id patient_id INT NOT NULL, CHANGE roles roles JSON DEFAULT '_utf8mb4\\''["ROLE_PATIENT"]\\''' NOT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE is_active is_active TINYINT(1) DEFAULT 1, DROP PRIMARY KEY, ADD PRIMARY KEY (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient_user ADD CONSTRAINT fk_patient_user_patient FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX uniq_patient_user_patient ON patient_user (patient_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient_user RENAME INDEX uniq_4029b81e7927c74 TO email
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pulse_measurements DROP FOREIGN KEY FK_9BE85D2E6B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pulse_measurements CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pulse_measurements ADD CONSTRAINT pulse_measurements_ibfk_1 FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE pulse_measurements RENAME INDEX idx_9be85d2e6b899279 TO patient_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE recommendation CHANGE additional_notes additional_notes TEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE recommendation RENAME INDEX idx_433224d26b899279 TO fk_recommendation_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sensor_alert_threshold CHANGE patient_id patient_id INT DEFAULT NULL, CHANGE parameter parameter VARCHAR(50) NOT NULL, CHANGE message message TEXT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sensor_alert_threshold RENAME INDEX idx_13413d7b6b899279 TO FK_SENSOR_THRESHOLD_PATIENT
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE temperature_measurements DROP FOREIGN KEY FK_5987B4D76B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE temperature_measurements CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE temperature_measurements ADD CONSTRAINT temperature_measurements_ibfk_1 FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE temperature_measurements RENAME INDEX idx_5987b4d76b899279 TO patient_id
        SQL);
    }
}
