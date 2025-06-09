<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250609013759 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE alarm CHANGE parameter parameter VARCHAR(255) NOT NULL, CHANGE condition_type condition_type VARCHAR(255) NOT NULL, CHANGE message message LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy CHANGE name name VARCHAR(255) DEFAULT NULL, CHANGE severity severity VARCHAR(100) DEFAULT NULL, CHANGE reaction reaction LONGTEXT DEFAULT NULL, CHANGE notes notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE consultation DROP reason, DROP diagnosis_icd10, CHANGE symptoms symptoms LONGTEXT NOT NULL, CHANGE notes notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL, CHANGE current_medication_ids current_medication_ids LONGTEXT DEFAULT NULL, CHANGE medical_history_ids medical_history_ids LONGTEXT DEFAULT NULL, CHANGE family_history family_history LONGTEXT DEFAULT NULL, CHANGE diagnosis_ids diagnosis_ids LONGTEXT DEFAULT NULL, CHANGE referral_ids referral_ids LONGTEXT DEFAULT NULL, CHANGE prescription_ids prescription_ids LONGTEXT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease CHANGE type type VARCHAR(255) DEFAULT NULL, CHANGE description description LONGTEXT DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor CHANGE created_at created_at DATETIME NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor RENAME INDEX email TO UNIQ_1FC0F36AE7927C74
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter CHANGE created_at created_at DATETIME NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_referral TO IDX_E55C59A53CCAA4B7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_patient TO IDX_E55C59A56B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_from_specialist TO IDX_E55C59A532440D8D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_to_doctor TO IDX_E55C59A5B6572C66
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX fk_medical_letter_consultation TO IDX_E55C59A562FF6CDF
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication CHANGE dose dose VARCHAR(255) NOT NULL, CHANGE frequency frequency VARCHAR(255) NOT NULL, CHANGE route route VARCHAR(255) NOT NULL, CHANGE start_date start_date DATE DEFAULT NULL, CHANGE notes notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient CHANGE valid_account valid_account TINYINT(1) DEFAULT 1 NOT NULL, CHANGE sex sex VARCHAR(1) DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX email TO UNIQ_1ADAD7EBE7927C74
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX cnp TO UNIQ_1ADAD7EB1EAB9B7E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE prescription CHANGE created_at created_at DATETIME NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE recommendation CHANGE activity_type activity_type VARCHAR(255) NOT NULL, CHANGE additional_notes additional_notes LONGTEXT DEFAULT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral CHANGE type type VARCHAR(50) NOT NULL, CHANGE reason reason LONGTEXT NOT NULL, CHANGE is_resolved is_resolved TINYINT(1) NOT NULL, CHANGE created_at created_at DATETIME NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX fk_referral_patient TO IDX_73079D006B899279
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX fk_referral_from_doctor TO IDX_73079D0097686EAD
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX fk_referral_to_doctor TO IDX_73079D00B6572C66
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE alarm CHANGE parameter parameter VARCHAR(100) NOT NULL, CHANGE condition_type condition_type VARCHAR(100) NOT NULL, CHANGE message message TEXT NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE allergy CHANGE name name VARCHAR(255) NOT NULL, CHANGE severity severity VARCHAR(255) DEFAULT NULL, CHANGE reaction reaction TEXT DEFAULT NULL, CHANGE notes notes TEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE consultation ADD reason TEXT NOT NULL, ADD diagnosis_icd10 VARCHAR(20) NOT NULL, CHANGE symptoms symptoms TEXT NOT NULL, CHANGE current_medication_ids current_medication_ids TEXT DEFAULT NULL, CHANGE medical_history_ids medical_history_ids TEXT DEFAULT NULL, CHANGE family_history family_history TEXT DEFAULT NULL, CHANGE notes notes TEXT DEFAULT NULL, CHANGE diagnosis_ids diagnosis_ids TEXT DEFAULT NULL, CHANGE referral_ids referral_ids TEXT DEFAULT NULL, CHANGE prescription_ids prescription_ids TEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE status status TINYINT(1) DEFAULT 1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE disease CHANGE type type VARCHAR(100) NOT NULL, CHANGE description description TEXT NOT NULL, CHANGE status status TINYINT(1) DEFAULT 1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor CHANGE status status TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE doctor RENAME INDEX uniq_1fc0f36ae7927c74 TO email
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter CHANGE status status TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a562ff6cdf TO fk_medical_letter_consultation
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a5b6572c66 TO fk_medical_letter_to_doctor
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a532440d8d TO fk_medical_letter_from_specialist
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a56b899279 TO fk_medical_letter_patient
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medical_letter RENAME INDEX idx_e55c59a53ccaa4b7 TO fk_medical_letter_referral
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE medication CHANGE dose dose VARCHAR(100) NOT NULL, CHANGE frequency frequency VARCHAR(100) NOT NULL, CHANGE route route VARCHAR(100) NOT NULL, CHANGE start_date start_date DATE NOT NULL, CHANGE notes notes TEXT DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient CHANGE valid_account valid_account TINYINT(1) DEFAULT 1, CHANGE sex sex VARCHAR(255) DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX uniq_1adad7eb1eab9b7e TO cnp
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE patient RENAME INDEX uniq_1adad7ebe7927c74 TO email
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE prescription CHANGE status status TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE recommendation CHANGE activity_type activity_type VARCHAR(100) NOT NULL, CHANGE additional_notes additional_notes TEXT DEFAULT NULL, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP, CHANGE status status TINYINT(1) DEFAULT 1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral CHANGE type type VARCHAR(255) NOT NULL, CHANGE reason reason TEXT NOT NULL, CHANGE is_resolved is_resolved TINYINT(1) DEFAULT 0, CHANGE status status TINYINT(1) DEFAULT 1, CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX idx_73079d00b6572c66 TO fk_referral_to_doctor
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX idx_73079d0097686ead TO fk_referral_from_doctor
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE referral RENAME INDEX idx_73079d006b899279 TO fk_referral_patient
        SQL);
    }
}
